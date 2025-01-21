<script lang="ts">
  import { type CellArray } from "@okcontract/cells";
  import { DataEditor, isArrayNode, type EditorNode } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";
  import {
    Button,
    InlineHelpText,
    SortableList,
    TabWrapperCell,
  } from "@okcontract/uic";

  import type { EditorOptions } from "../types";
  import EditorNodeCell from "./EditorNodeCell.svelte";
  import ObjectArrayItem from "./ObjectArrayItem.svelte";

  export let instance: OKPage;
  const proxy = instance.proxy;

  export let editor: DataEditor;
  export let node: EditorNode;
  export let options: EditorOptions = {};

  const array = isArrayNode(node) && node.array;
  const value = proxy.get(node.value) as unknown as CellArray<unknown[]>;
  const definition = node.definition;
  const max = $definition && "max" in $definition && $definition.max;

  const list = proxy.new([], "list");
  value.subscribe((_value) =>
    list.set(
      Object.entries(_value).map(([k, v]) => ({
        id: k,
        // @todo v should maybe be mapped at the source
        v,
      })),
    ),
  );

  const params = editor.params;

  const selectedTab = proxy.new(0, "ObjectArrayEdit.selectedTab");

  const isEditable = "set" in value && !options?.view;
  const showAsTabs = "showAsTabs" in $definition;

  // @todo take from EditorNode
  const elementDefinition =
    $definition && "array" in $definition
      ? { label: "", ...$definition.array }
      : { label: "", base: "string" }; //,

  const itemName =
    "name" in elementDefinition
      ? elementDefinition.name
      : "showAsTabs" in $definition
        ? "tab"
        : "field";

  // @todo implement
  const hasDuplicates = (value) => false;
</script>

<ol
  class={options?.view && "cssView" in $definition
    ? $definition.cssView
    : "css" in $definition
      ? $definition.css
      : options?.view
        ? "flex flex-wrap gap-1 items-center px-1"
        : "grid gap-2"}
>
  {#if $value instanceof Error}
    Error at $value {$value}
  {:else if $array instanceof Error}
    Error array {$array}
  {:else if $array}
    {#if $definition && "unique" in $definition && $definition.unique && hasDuplicates(value)}
      <InlineHelpText style="error">Must be unique</InlineHelpText>
    {/if}
    {#if $definition && "min" in $definition && BigInt($definition.min) > $value.length}
      <InlineHelpText style="error">
        Must contain at least {$definition.min}
        {itemName}
      </InlineHelpText>
    {/if}
    {#if $definition && "sort" in $definition && $definition.sort}
      <SortableList
        sortable={true}
        {list}
        on:sort={(ev) => {
          // @todo order implementation
          // const order = ev.detail.map(({ id }) => id);
          // dispatch("order", {
          //   v: order,
          //   path: [...common_path, ...local_path],
          // });
        }}
        let:item
        let:index
      >
        {#if item !== null}
          {@const itemNode = $array[index]}
          <!-- @todo use ObjectArrayItem? -->
          <li class="flex flex-wrap gap-1 items-center">
            <div class="grow">
              <EditorNodeCell {instance} {editor} node={itemNode} {options} />
            </div>
            {#if isEditable}
              {#if ("min" in $definition && $value?.length > $definition.min) || !$definition?.min}
                <div class="{'isExpr' in $definition ? 'absolute' : 'flex'} ">
                  <Button
                    style="ghost"
                    square={true}
                    iconAppend={true}
                    size="xs"
                    icon="close"
                    disabled={params.disabled}
                    action={() => editor.removeElement(node, index)}
                  />
                </div>
              {/if}
            {/if}
          </li>
        {/if}
      </SortableList>
    {:else if $array?.length}
      <TabWrapperCell
        selected={selectedTab}
        showAsTabs={"showAsTabs" in $definition && $definition?.showAsTabs}
        canAdd={isEditable ? !max || BigInt(max) > $value.length : false}
        addElement={() => editor.addElement(node)}
        canRemove={("min" in $definition &&
          BigInt($definition.min) < $value.length) ||
          !("min" in $definition) ||
          !$definition?.min}
        removeElement={async (i) => {
          editor.removeElement(node, i);
          await instance.proxy.working.wait();
          selectedTab.set(i === 0 ? 0 : i - 1);
        }}
        {value}
        let:item
        let:index
      >
        <ObjectArrayItem
          {instance}
          {editor}
          {node}
          pardef={definition}
          {index}
          child={$array[index]}
          parentLength={$value.length}
          {params}
          {options}
        />
      </TabWrapperCell>
    {/if}
  {/if}
</ol>

{#if $value instanceof Error}
  Error value: {$value}
{:else if isEditable}
  {#if !showAsTabs && (!max || BigInt(max) > $value.length)}
    <div class="mt-2 flex flex-row items-center">
      <Button
        style="default"
        outline={true}
        size="sm"
        iconPrepend={true}
        label={`Add row`}
        icon="add"
        action={() => {
          editor.addElement(node);
        }}
      />
      <!-- ${itemName} -->
    </div>
  {/if}
{/if}
