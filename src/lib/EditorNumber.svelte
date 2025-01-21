<script lang="ts">
  import type { DataEditor, EditorNode } from "@okcontract/fred";
  import { Rational } from "@okcontract/lambdascript";
  import { formatBig, type OKPage } from "@okcontract/sdk";
  import {
    Range,
    ThemeBackgroundTransparent,
    ThemeText,
    getTheme,
  } from "@okcontract/uic";

  import type { EditorOptions } from "../types";

  export let editor: DataEditor;
  export let instance: OKPage;
  const proxy = instance.proxy;

  export let node: EditorNode;
  const definition = node.definition;
  const value = proxy.get(node.value);

  export let options: EditorOptions = {};
  $: disabled =
    !!options?.view ||
    !("set" in value) ||
    ("locked" in $definition && $definition?.locked);

  const theme = getTheme();
  const compiledTheme = theme?.compiled;

  const isRational = (v: unknown): v is Rational =>
    typeof v === "object" && "simplify" in v;

  $: def =
    ($definition && !($definition instanceof Error) && $definition) ||
    undefined;
  $: label = def?.label;
  // @todo check fine with large values?
  // @todo can we use native input with bigint?
  $: vBig = isRational($value)
    ? $value.toBigInt()
    : typeof $value === "number" || typeof $value === "bigint"
      ? BigInt($value)
      : typeof $value === "string" // @todo should not happen
        ? BigInt($value)
        : BigInt(0);
  $: min = "min" in def ? BigInt(def.min?.toString()) : undefined;
  $: max =
    "max" in $definition && $definition.max
      ? typeof $definition.max === "number"
        ? BigInt($definition.max)
        : BigInt($definition.max.toBigInt())
      : undefined;

  const convert = (
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => {
    const v = BigInt(ev.currentTarget.value.replaceAll(",", "") || 0);
    return new Rational(max && v > max ? max : v);
  };

  $: console.log("EditorNumber", { $value, vBig, min, max, label });
</script>

{#if $definition instanceof Error}
  Error at definition {$definition}
{:else if max !== undefined}
  {@const unit = ("unit" in def && def.unit) || ""}
  {@const required = !("optional" in def && def.optional)}
  <!-- @todo decimals is never Rational? -->
  {@const decimals =
    ("decimals" in def &&
      (isRational(def.decimals)
        ? def.decimals.toBigInt()
        : BigInt(def.decimals || 0n))) ||
    0n}
  <Range
    {label}
    {required}
    {unit}
    {decimals}
    value={vBig}
    {min}
    {max}
    {disabled}
    on:input={(ev) => editor.update(node, new Rational(ev.detail))}
  />
{:else if def}
  {#if disabled}
    <div class="px-1 flex items-center gap-1">
      {formatBig(vBig, 0)}
      {#if "unit" in def && def.unit}
        <div
          class="label-text opacity-70 {theme.dark(
            $compiledTheme,
            'input-white-alpha',
            'input-black-alpha',
            '',
          )}"
        >
          {def.unit}
        </div>
      {/if}
    </div>
  {:else}
    {@const placeholder = "pl" in def ? def.pl : null}
    {@const step = "step" in def ? def.step : 1}
    <label
      class="input input-bordered flex items-center {disabled
        ? 'input-disabled'
        : ''} {theme.dark(
        $compiledTheme,
        'input-white-alpha',
        'input-black-alpha',
        '',
      )}"
      style={theme.apply(
        $compiledTheme,
        [ThemeText],
        [ThemeBackgroundTransparent],
      )}
    >
      <input
        {disabled}
        value={vBig.toString()}
        {placeholder}
        title={label}
        type={max < 1_000_000n ? "number" : "string"}
        {step}
        min={Number(min)}
        max={max?.toString()}
        on:input={(ev) => editor.update(node, convert(ev))}
        class="grow w-10"
      />
      {#if "unit" in def && def.unit}
        <div
          class="label-text opacity-70 {theme.dark(
            $compiledTheme,
            'input-white-alpha',
            'input-black-alpha',
            '',
          )}"
        >
          {def.unit}
        </div>
      {/if}
    </label>
  {/if}
{/if}
