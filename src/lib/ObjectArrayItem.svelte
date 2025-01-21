<script lang="ts">
  import { type AnyCell, type MapCell } from "@okcontract/cells";
  import type {
    DataEditor,
    EditorNode,
    LabelledTypeDefinition,
  } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";
  import { Button } from "@okcontract/uic";

  import type { EditorOptions } from "../types";
  import EditorNodeCell from "./EditorNodeCell.svelte";

  export let instance: OKPage;
  export let editor: DataEditor;
  export let node: EditorNode; // parent
  export let index: number;
  export let child: MapCell<EditorNode, false>;
  // @todo export parent instead?
  export let pardef: AnyCell<LabelledTypeDefinition>;
  export let params;
  export let parentLength: number; // @todo parent $value.length
  export let options: EditorOptions = {};

  const value = instance.proxy.get(node.value);

  const definition = child.map((node) => node.definition);
  $: deletable =
    (($definition &&
      "min" in $definition &&
      Number($definition.min) < parentLength) ||
      true) &&
    !options?.view &&
    "set" in value;
</script>

<li class="flex flex-wrap gap-1 items-start">
  <!-- @todo fix node cell -->
  <div class="grow">
    <EditorNodeCell {instance} {editor} node={child} {options}></EditorNodeCell>
  </div>
  {#if deletable && !("showAsTabs" in $pardef)}
    <div class="{'isExpr' in $definition ? 'absolute right-0' : ''} ">
      <Button
        style="ghost"
        size="xs"
        square={true}
        iconAppend={true}
        icon="close"
        disabled={params.disabled}
        action={async () => editor.removeElement(node, index)}
      />
    </div>
  {/if}
</li>
