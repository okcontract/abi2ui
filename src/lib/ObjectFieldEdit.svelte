<!-- @todo rename EditorNode -->
<script lang="ts">
  import { jsonStringify, nextSubscriber, type Path } from "@okcontract/cells";
  import {
    DataEditor,
    isArrayNode,
    isDictNode,
    isObjectNode,
    type EditorNode,
  } from "@okcontract/fred";
  import { formatError, type OKPage } from "@okcontract/sdk";
  import { InlineHelpText } from "@okcontract/uic";

  import type { EditorOptions } from "../types";
  import EditorLeaf from "./EditorLeaf.svelte";
  import ObjectArrayEdit from "./ObjectArrayEdit.svelte";
  import ObjectStoreEdit from "./ObjectStoreEdit.svelte";

  export let instance: OKPage;
  const proxy = instance.proxy;

  export let editor: DataEditor;
  export let node: EditorNode;
  export let options: EditorOptions = {};

  const value = proxy.get(node.value);
  const valid = node.valid;
  const definition = node.definition;

  $: error = $valid instanceof Error ? formatError($valid) : null;
  let hideError = true;
  nextSubscriber(value, (_) => (hideError = false));

  const placeholder = (path: Path): string => {
    if (!path?.length) return "";
    const last = path[path.length - 1];
    if (typeof last === "number")
      return placeholder(path.slice(path.length - 1, 1)) + ` #${last}`;
    if (typeof last === "string") return last;
    return "";
  };
</script>

{#if $definition instanceof Error}
  Error in $definition: {$definition}
{:else}
  {#if editor?.params?.showDefinition && $definition && !("object" in $definition)}
    <h4>Definition:</h4>
    {jsonStringify($definition)}<br />
  {/if}

  {#if isArrayNode(node)}
    <ObjectArrayEdit {instance} {editor} {node} {options} on:update />
  {:else if isDictNode(node)}
    <div>Unsupported input</div>
  {:else if isObjectNode(node)}
    <div
      class={`${$definition && "inline" in $definition && $definition.inline ? "flex items-center gap-1" : "grid gap-2"}`}
    >
      <ObjectStoreEdit {instance} {editor} {node} {options} on:update
      ></ObjectStoreEdit>
    </div>
  {:else}
    <EditorLeaf {instance} {editor} {node} {options} />
  {/if}
{/if}

<slot />

{#if error && !hideError}
  {#if "help" in $definition}
    <div class="label">
      <InlineHelpText style="info">{$definition.help}</InlineHelpText>
    </div>
  {:else}
    <div class={$definition && "object" in $definition ? "" : "label"}>
      <InlineHelpText style={error.type} icon={error.type}
        >{error.message}</InlineHelpText
      >
    </div>
  {/if}
{/if}
