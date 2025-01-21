<script lang="ts">
  import { DataEditor, type EditorNode } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";
  import { Button } from "@okcontract/uic";

  import type { EditorOptions } from "../types";
  import ObjectFieldEdit from "./ObjectFieldEdit.svelte";
  import ObjectLabel from "./ObjectLabel.svelte";

  export let instance: OKPage;
  const proxy = instance.proxy;

  export let editor: DataEditor;
  const params = editor?.params;

  export let node: EditorNode;
  export let parent: EditorNode;

  const definition = node.definition;
  const value = proxy.get(node.value);

  export let options: EditorOptions = {};

  const isHovering = proxy.new(false, "isHovering");

  $: locked = $definition && "locked" in $definition && $definition.locked;
  $: optional =
    $definition && "optional" in $definition && $definition.optional;

  const deletable =
    value &&
    proxy.map(
      [value, isHovering],
      (_value, _isHovering) => {
        const withOptional = optional ? _value !== null : false;
        return (
          _isHovering &&
          _value !== null &&
          withOptional &&
          !locked &&
          !options?.view
        );
      },
      "ObjectEditItem.closeBtn",
    );
  $: showLabel =
    !($definition && "hideLabel" in $definition && $definition.hideLabel) &&
    !options.hideLabels &&
    !($definition && "dict" in $definition && Object.keys($value).length === 0);

  $: customCss =
    options?.view && "cssView" in $definition
      ? $definition.cssView
      : "css" in $definition
        ? $definition.css
        : "relative";
</script>

{#if $definition instanceof Error}
  Error {$definition}
{:else if $definition && !($definition && "hidden" in $definition && $definition.hidden) && $value !== undefined && $value !== null}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class={customCss}
    on:mouseenter={(ev) => {
      if (!params?.highlightOnHover) return;
      $isHovering = true;
    }}
    on:mouseleave={(ev) => {
      if (!params?.highlightOnHover) return;
      $isHovering = false;
    }}
  >
    <!-- {node} -->
    <ObjectLabel
      display={params?.showLabels || true}
      {showLabel}
      def={$definition}
      itemHover={isHovering}
      highlightOnHover={params?.highlightOnHover || false}
      {options}
    ></ObjectLabel>
    <ObjectFieldEdit {instance} {node} {editor} {options} />
    {#if deletable && $deletable}
      <div class="absolute top-0 right-0">
        <Button
          style="ghost"
          size="xs"
          label={"array" in $definition && $definition.array
            ? "Delete section"
            : ""}
          iconPrepend={true}
          icon={"array" in $definition && $definition.array
            ? "remove-o"
            : "close"}
          disabled={params.disabled}
          action={() =>
            editor.removeProperty(
              parent,
              node.key || node.path[node.path.length - 1],
            )}
        />
      </div>
    {/if}
  </div>
{/if}
