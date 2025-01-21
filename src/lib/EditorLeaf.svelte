<script lang="ts">
  import { type AnyCell } from "@okcontract/cells";
  import type { DataEditor, EditorNode } from "@okcontract/fred";
  import {
    isAddress,
    nullAddr,
    type Address,
    type Network,
  } from "@okcontract/multichain";
  import { EnvKeySelf, type OKPage } from "@okcontract/sdk";
  import {
    Calendar,
    Checkbox,
    Loading,
    ThemeText,
    getTheme,
  } from "@okcontract/uic";

  import { type EditorOptions } from "../types";
  import AddressInput from "./AddressInput.svelte";
  import EditorNumber from "./EditorNumber.svelte";
  import ValidInput from "./ValidInput.svelte";

  export let editor: DataEditor;
  const env = editor?.env;

  const self = env?.value(EnvKeySelf) as AnyCell<Address<Network>> | undefined;

  export let instance: OKPage;
  const proxy = instance.proxy;

  export let node: EditorNode;
  const definition = node.definition;
  const value = proxy.get(node.value);
  const valid = node.valid;

  export let options: EditorOptions = {};
  $: placeholder =
    ($definition && "pl" in $definition && $definition.pl) || null;
  $: disabled =
    !!options?.view ||
    !("set" in value) ||
    ("locked" in $definition && $definition?.locked);

  const theme = getTheme();
  const compiledTheme = theme?.compiled;

  // @todo move to `@okcontract/fred`
  const type = proxy.mapNoPrevious(
    [value, definition],
    (v, def) => {
      // console.log({ v, def });
      if (def) {
        return "dict" in def
          ? "dict"
          : "object" in def
            ? "object"
            : "array" in def
              ? "array"
              : "enum" in def
                ? "enum"
                : "isAddress" in def && def.isAddress
                  ? "address"
                  : "base" in def
                    ? def.base
                    : null;
      }
      return typeof v === "object" && "simplify" in v
        ? "rational"
        : isAddress(v)
          ? "address"
          : v instanceof Date
            ? "date"
            : Array.isArray(v)
              ? "array"
              : typeof v;
    },
    "EL:type",
  );

  const onInput = (ev: Event) =>
    editor.update(node, (ev.target as HTMLInputElement).value);
</script>

{#if $type instanceof Error}
  Error in type: {$type}
{:else if $definition instanceof Error}
  Error in definition: {$definition}
{:else if $definition === undefined}
  <Loading />
{:else if $type === "string"}
  {#if "isBinary" in $definition && $definition?.isBinary}
    {$definition.label}
    <ValidInput
      {value}
      {placeholder}
      pattern={/0x[0-9a-fA-F]*/}
      {valid}
      {disabled}
      on:input={onInput}
    />
  {:else if ("long" in $definition && $definition.long) || ("isExpr" in $definition && $definition.isExpr)}
    {#if options?.view}
      <div class="px-1 font-medium">
        {$definition.long?.[$value] || $value}
      </div>
    {:else}
      <textarea
        value={$value}
        {disabled}
        on:input={onInput}
        {placeholder}
        class="textarea textarea-bordered min-h-48 w-full {theme.dark(
          $compiledTheme,
          'input-white-alpha',
          'input-black-alpha',
          '',
        )}"
      ></textarea>
    {/if}
  {:else if "isColor" in $definition && $definition.isColor}
    {#if options?.view}
      <input
        {disabled}
        type="color"
        value={$value}
        class="bg-transparent w-10"
        on:input={onInput}
      />
    {:else}
      <label
        class="input input-bordered flex items-center {disabled
          ? 'input-disabled'
          : ''} {theme.dark(
          $compiledTheme,
          'input-white-alpha',
          'input-black-alpha',
          '',
        )}"
      >
        <input
          {disabled}
          type="color"
          value={$value}
          class="bg-transparent w-10"
          on:input={onInput}
        />
      </label>
    {/if}
  {:else if "locked" in $definition && $definition?.locked}
    <div class="flex-none w-40 break-all font-medium">
      {$value}
    </div>
  {:else}
    <ValidInput
      {value}
      {disabled}
      {placeholder}
      pattern={$definition && "pattern" in $definition
        ? $definition.pattern
        : undefined}
      {valid}
      on:input={onInput}
    />
  {/if}
{:else if $type === "enum" && "enum" in $definition}
  <!-- @todo uic/select with Cell -->
  {#if options?.view}
    <div class="px-1 font-medium">
      {$definition.enum?.[$value] || $value}
    </div>
  {:else}
    <select
      {disabled}
      value={$value || $definition?.default}
      on:input={onInput}
      class="select select-bordered select-md {theme.dark(
        $compiledTheme,
        'input-white-alpha',
        'input-black-alpha',
        '',
      )}"
      style={theme.apply($compiledTheme, [ThemeText])}
    >
      <!-- @todo if enum is an object display the object -->
      {#if Array.isArray($definition.enum)}
        {#each $definition.enum as v}
          <!-- @todo reactive... -->
          <option value={"value" in v ? v.value : v}>
            {"value" in v ? v.value : v}
          </option>
        {/each}
      {:else}
        {#each Object.entries($definition.enum) as [k, v]}
          <option value={k}>
            {(v && typeof v === "object" && v?.label) || v}
          </option>
        {/each}
      {/if}
    </select>
  {/if}
{:else if $type === "address"}
  {@const name = $definition?.label?.toLowerCase() || undefined}
  {@const disableOneClick =
    "disableOneClick" in $definition && $definition.disableOneClick}
  <AddressInput
    {instance}
    isValid={true}
    {placeholder}
    search={"search" in $definition ? $definition?.search : null}
    input={$value?.toString()}
    {disabled}
    oneClick={disableOneClick ||
    !self ||
    !$self ||
    $self instanceof Error ||
    name?.includes("token")
      ? undefined
      : ["My wallet", $self.toString()]}
    on:update={(ev) => {
      $definition instanceof Error
        ? undefined
        : editor.update(node, ev.detail === "0x0" ? nullAddr : ev.detail);
    }}
    removable
  />
{:else if $type === "number" || $type === "bigint" || $type === "rational"}
  <EditorNumber {instance} {node} {editor} {options} />
{:else if $type === "boolean"}
  {#if disabled}
    {$value}
  {:else}
    <Checkbox
      {disabled}
      value={$value}
      label=""
      on:toggle={(ev) => editor.update(node, ev.detail)}
    />
  {/if}
{:else if $type === "date"}
  <Calendar
    {disabled}
    time={$value}
    dayOnly={true}
    on:update={(ev) => editor.update(node, ev.detail.date)}
  />
{/if}
