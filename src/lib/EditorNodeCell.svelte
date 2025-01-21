<script lang="ts">
  import type { AnyCell } from "@okcontract/cells";
  import type { DataEditor, EditorNode } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";

  import type { EditorOptions } from "../types";

  import ObjectFieldEdit from "./ObjectFieldEdit.svelte";

  export let instance: OKPage;
  export let editor: DataEditor;
  export let node: AnyCell<EditorNode>;
  export let options: EditorOptions = {};
</script>

{#if $node instanceof Error}
  Error {$node}
{:else if $node}
  <ObjectFieldEdit {instance} {editor} node={$node} {options}>
    <slot />
  </ObjectFieldEdit>
{/if}
