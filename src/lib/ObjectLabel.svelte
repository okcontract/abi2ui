<script lang="ts">
  import type { ValueCell } from "@okcontract/cells";
  import type { LabelledTypeDefinition } from "@okcontract/fred";
  import { ThemeText, getTheme } from "@okcontract/uic";

  import type { EditorOptions } from "../types";

  export let display: boolean = true;
  export let showLabel: boolean = true;
  export let highlightOnHover: boolean = true;
  export let itemHover: ValueCell<boolean> = undefined;
  export let options: EditorOptions = {};
  export let def: LabelledTypeDefinition = undefined;

  const theme = getTheme();
  const compiledTheme = theme?.compiled;
</script>

{#if display && showLabel && def?.label}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="label {options?.view ? 'mt-2' : ''}">
    <span
      class="label-text opacity-70 flex gap-1 items-center {theme.dark(
        $compiledTheme,
        'text-white',
        'text-black',
        'text-base-content',
      )}"
      style={theme.apply($compiledTheme, [ThemeText])}
      on:mouseenter={(ev) => {
        if (!highlightOnHover) return;
        $itemHover = true;
      }}
      on:mouseleave={(ev) => {
        if (!highlightOnHover) return;
        $itemHover = false;
      }}
    >
      {#if showLabel && def?.label}
        {def.label}
      {/if}
    </span>
    <slot />
  </div>
{/if}
