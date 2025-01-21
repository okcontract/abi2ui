<script lang="ts">
  import {
    DataEditor,
    type EditorGroup,
    type EditorNode,
    type NodeObject,
  } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";

  import type { EditorOptions } from "../types";
  import EditorSection from "./EditorSection.svelte";
  import ObjectEditItem from "./ObjectEditItem.svelte";
  import ObjectUndefinedPaths from "./ObjectUndefinedPaths.svelte";

  export let page: OKPage;
  const proxy = page.proxy;

  export let editor: DataEditor;
  export let node: EditorNode & NodeObject;
  export let options: EditorOptions = {};
  export let group: EditorGroup;
  export let groups: number;
</script>

<EditorSection
  {proxy}
  label={group[0].l}
  showSection={node.path.length < 2 && groups > 1}
  {options}
>
  <!-- defined nodes -->
  {#each group[1] || [] as child (child.id)}
    <ObjectEditItem
      instance={page}
      {editor}
      node={child}
      parent={node}
      {options}
    />
  {/each}

  <!-- undefined nodes -->
  {#if !options?.view}
    {#key group[2]}
      <ObjectUndefinedPaths {editor} parent={node} nodes={group[2] || []}
      ></ObjectUndefinedPaths>
    {/key}
  {/if}
</EditorSection>
