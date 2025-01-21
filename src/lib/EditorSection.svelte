<script lang="ts">
  import type { SheetProxy } from "@okcontract/cells";
  import { Card, Collapsible } from "@okcontract/uic";

  import type { EditorOptions } from "../types";

  export let proxy: SheetProxy;
  export let label: string;
  export let showSection: boolean;
  export let options: EditorOptions = {};
</script>

{#if showSection && !options?.noCollapsible}
  <Collapsible
    style={options?.sectionClass || (options?.view ? "base" : "transparent")}
    size="md"
    {proxy}
  >
    <span slot="heading">
      <h4>
        {label}
      </h4>
    </span>
    <slot />
  </Collapsible>
{:else if showSection}
  <Card style="base">
    <h4 class="m-1">
      {label}
    </h4>
    <slot />
  </Card>
{:else}
  <slot />
{/if}
