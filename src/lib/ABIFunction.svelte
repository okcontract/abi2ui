<script lang="ts">
  import { type ValueCell } from "@okcontract/cells";
  import {
    EnvKeySlippage,
    type AnyContractQuery,
    type OKPage,
    type OKTransaction,
  } from "@okcontract/sdk";
  import { AlertBanner } from "@okcontract/uic";

  import DataEditor from "./DataEditor.svelte";
  import SendTx from "./SendTX.svelte";
  import Value from "./Value.svelte";

  // Constants
  const lowSlippage = 0.1;
  const highSlippage = 5;

  export let instance: OKPage;
  export let okTX: OKTransaction<AnyContractQuery>;
  export let hideLabels = true;

  $: btnName = okTX.btnLabel;
  $: func = okTX.function;
  $: isSending = okTX.isSending;
  $: tx = okTX.tx;
  $: canSendTX = okTX.canSendTX;
  $: env = okTX.env;
  $: editor = okTX.editor;
  const readOutput = okTX.readOutput;

  $: slippage = env?.map(
    (_env) => _env.value(EnvKeySlippage) as ValueCell<bigint>,
    "ABIFunction.slippage",
  );
</script>

{#if $editor && !($editor instanceof Error)}
  {#key editor.id}
    <DataEditor {instance} editor={$editor} options={{ hideLabels }} />
  {/key}
{/if}

{#if $func instanceof Error}
  Error at $func {$func}
{:else if $func?.stateMutability === "view"}
  Read-only
  <Value {instance} item={$readOutput} />
{:else if !($slippage instanceof Error)}
  {#if $slippage <= lowSlippage || $slippage >= highSlippage}
    <div class="absolute bottom-0 left-0 right-0 z-30">
      <AlertBanner style="warning" icon="warning" size="sm">
        <span>
          <b>{$slippage >= highSlippage ? "High" : "Low"} slippage!</b>The
          transaction may {$slippage >= highSlippage ? "be frontrun" : "fail"}
        </span></AlertBanner
      >
    </div>
  {/if}
  {#key okTX}
    <SendTx
      {instance}
      {okTX}
      label={$btnName instanceof Error ? "Send" : $btnName}
      disabled={!$canSendTX || $tx instanceof Error || $isSending}
      on:submit
      on:sent
      on:error
    />
  {/key}
{/if}
