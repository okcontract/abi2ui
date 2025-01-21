<script lang="ts">
  import type { OKPage } from "@okcontract/sdk";

  import Value from "./Value.svelte";

  export let instance: OKPage;

  export let item: any;
  export let size: "smb" | "sm" | "md" = "sm";
</script>

{#if Array.isArray(item)}
  {#each item as element, i}
    <Value {instance} item={element} size={i % 2 ? "smb" : size} />
  {/each}
{:else if typeof item === "object"}
  <ul>
    {#each Object.keys(item) as element, i}
      <li>
        {element}
        <Value {instance} item={item[element]} />
      </li>
    {/each}
  </ul>
{:else if item}
  <div class="gap-1">
    {item}
  </div>
{/if}
