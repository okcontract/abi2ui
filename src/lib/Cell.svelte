<script lang="ts">
  import { type AnyCell } from "@okcontract/cells";
  import type { OKPage } from "@okcontract/sdk";

  import Value from "./Value.svelte";

  export let instance: OKPage;
  export let item: AnyCell<any>;
  export let size: "smb" | "sm" | "md" = "sm";
</script>

{#if $item instanceof Error}
  <span title={$item.message}>...</span>
{:else if Array.isArray($item)}
  {#each $item as element, i}
    <Value {instance} item={element} size={i % 2 ? "smb" : size} />
  {/each}
{:else if $item !== undefined}
  {$item}
{:else}
  <span class="loading loading-spinner loading-xs"></span>
{/if}
