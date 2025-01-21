<script lang="ts">
  import type { OKPage, Stepper } from "@okcontract/sdk";
  import { AlertBanner } from "@okcontract/uic";

  import ABIFunction from "./ABIFunction.svelte";

  export let instance: OKPage;
  export let stepper: Stepper;
  export let hideLabels = true;

  const okTX = stepper.current;
  const isDone = stepper.isDone;
  const isLastTX = stepper.isLastTX;
</script>

{#if $okTX instanceof Error}
  <div class="p-4">
    <AlertBanner style="warning"
      ><span class="max-w-[265px]"
        ><strong
          >Error in interaction specification:
        </strong>{$okTX.message}</span
      ></AlertBanner
    >
  </div>
{:else if $okTX}
  <div
    class="absolute bottom-12 left-0 right-0 top-12 overflow-y-auto overscroll-y-contain"
  >
    {#if $isDone && $okTX.receipt}
      <div class="px-4 mt-4">Transaction successful</div>
    {:else if $isLastTX}
      <div class="px-4 mt-4">
        <div class="my-4 flex w-full justify-center">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <h4 class="flex w-full justify-center">
          Transaction in progress. Please wait...
        </h4>
      </div>
    {:else}
      <div class="px-4 text-left">
        <div
          class="py-2 flex gap-1 flex-wrap items-center text-base font-semibold"
        ></div>
        <ABIFunction {instance} okTX={$okTX} {hideLabels} />
      </div>
    {/if}
  </div>
{/if}
