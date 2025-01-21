<script lang="ts">
  import type { OKPage } from "@okcontract/sdk";

  import Cell from "./Cell.svelte";
  import Raw from "./Raw.svelte";

  export let instance: OKPage;

  export let item: any;
  export let size: "smb" | "sm" | "md" = "sm";
  const isCell = (v: unknown) => v && typeof v === "object" && "value" in v;
</script>

{#if !item}
  .
{:else if isCell(item)}
  <Cell {instance} {item} {size}></Cell>
{:else if item instanceof Error}
  *
{:else}
  <Raw {instance} {item} {size}></Raw>
{/if}
