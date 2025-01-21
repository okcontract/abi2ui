<!-- @todo rename to EditorGroups -->
<script lang="ts">
  import {
    DataEditor,
    type EditorNode,
    type NodeObject,
  } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";

  import type { EditorOptions } from "../types";
  import EditorGroup from "./EditorGroup.svelte";

  export let instance: OKPage;
  export let editor: DataEditor;
  export let node: EditorNode & NodeObject;
  export let options: EditorOptions = {};

  const groups = editor.groups(node);
</script>

{#if !($groups instanceof Error)}
  {#each $groups || [] as group}
    <EditorGroup
      page={instance}
      {editor}
      {node}
      {group}
      {options}
      groups={$groups.length}
    />
  {/each}
{/if}
