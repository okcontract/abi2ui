<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import type { OKPage } from "@okcontract/sdk";
  import { getTheme } from "@okcontract/uic";

  import WalletAddress from "./WalletAddress.svelte";

  export let instance: OKPage;
  /** optional one click address (used for "My wallet") */
  export let oneClick: [string, string] = undefined;
  export let search: string = undefined;
  export let removable = false;
  export let input = "";
  export let placeholder: string = undefined;
  export let isValid: boolean = true;
  export let disabled = false;

  const theme = getTheme();
  const compiled = theme.compiled;

  let touched = false;
  const update = (ev) => {
    if (!search) {
      input = (ev.target as any)?.value || ev.detail;
    } else {
      input = ev.detail;
    }
    touched = true;
    dispatch("update", input);
  };
</script>

<div
  class="input {theme.dark(
    $compiled,
    `input-ghost`,
    `input-ghost`,
    `input-bordered`,
  )} {!isValid && touched
    ? 'border-error'
    : ''} input-md flex items-center gap-2"
>
  <WalletAddress
    {instance}
    addrStr={input}
    style={true}
    {oneClick}
    {removable}
    {placeholder}
    truncate={false}
    {disabled}
    on:update={update}
  />
</div>
