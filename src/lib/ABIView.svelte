<script lang="ts">
  import { type AnyCell } from "@okcontract/cells";
  import {
    type AnyContractQuery,
    filterABIMethods,
    getAbiFunction,
    OKContract,
    OKPage,
  } from "@okcontract/sdk";
  import {
    Button,
    Collapsible,
    Icon,
    Loading,
    MasterDetail,
  } from "@okcontract/uic";

  import OpLogo from "../assets/optimism-logo.svg";
  import AbiViewWidget from "./ABIViewWidget.svelte";

  export let contract: OKContract<AnyContractQuery>;
  export let query: AnyCell<AnyContractQuery>;

  export let instance: OKPage;
  const proxy = instance.proxy;
  const core = instance.core;

  const USE_ABI = true;

  const abi = contract.abi;
  const abix = contract.abix;
  const addr = contract.address;
  const chain = contract.chain;
  const VRW = contract.VRW;
  const pEnv = contract.pEnv;

  const allMethods = proxy.map(
    [core.Role, VRW, pEnv, abix],
    (_role, _VRW, _pEnv, _abix) => filterABIMethods(_role, _VRW, _pEnv, _abix),
  );

  // @todo push URL to history when method is selected
  const selected = proxy.new(undefined, "selected");
  const initialMethod = proxy.map([abi], (abi) => getAbiFunction(abi.parsed));
  initialMethod.subscribe((_method) => {
    if (_method instanceof Error) return;
    selected.set(_method?.name);
  });

  const isOpen = proxy.new(true);
</script>

<div>
  {#if $allMethods === undefined}
    <Loading />
  {:else if $allMethods instanceof Error}
    <h4 class="capitalize text-xl font-semibold">Not found</h4>
    <p>
      {"reason" in $allMethods ? $allMethods.reason : $allMethods?.message}
    </p>
  {:else if !($chain instanceof Error) && $chain}
    <div
      class="flex flex-wrap gap-3 items-center justify-between border-b border-base-300 px-4 py-2"
    >
      <div class="flex shrink-0 flex-row items-center space-x-2">
        <img src={OpLogo} class="h-8 w-8" alt="OP" />
        <h4 class="capitalize text-xl font-semibold">
          {$chain} ABI
        </h4>
      </div>
      <div class="flex space-x-3">
        <Button
          asyncAction={async () => {
            navigator.clipboard.writeText(await contract.ABIString());
          }}
          iconPrepend={true}
          icon="copy-o"
          outline={true}
          label="Copy ABI"
        />
      </div>
    </div>
    {#if !($VRW instanceof Error) && !($addr instanceof Error)}
      {#if USE_ABI && !($abix instanceof Error) && !($allMethods instanceof Error) && !($query instanceof Error) && $allMethods}
        <!-- {$query} -->
        <div class="flex flex-col items-stretch md:flex-row">
          <MasterDetail
            selectedKey={selected}
            data={$allMethods}
            title={"Methods"}
            height="h-[500px]"
            addThirdPanel
          >
            <span slot="master" let:value={fn} let:index={i}>
              <div class="flex flex-row items-center justify-between">
                <div class="flex text-left">
                  <div class="break-all text-xs" title={$allMethods?.[i]?.[0]}>
                    {$allMethods?.[i]?.[0]}
                  </div>
                </div>
                <div
                  class="flex justify-end space-x-1 {fn?.stateMutability ===
                  'view'
                    ? 'w-20'
                    : ''}"
                >
                  {#if fn?.stateMutability === "view"}
                    <span class="badge badge-outline badge-accent"
                      >Readonly</span
                    >
                  {/if}
                </div>
              </div>
            </span>
            <span
              slot="detail"
              let:value={fn}
              class="bg-base-200 relative flex h-[500px] sm:w-[500px] shrink-0 grow overflow-auto border-l border-r border-base-300 p-4"
            >
              {#key $selected || $chain}
                <AbiViewWidget
                  instance={new OKPage(core)}
                  method={$selected}
                  query={$query}
                />
              {/key}
            </span>
            <span
              slot="third"
              let:value={fn}
              class="bg-base-100 flex h-[500px] overflow-auto {$isOpen
                ? 'basis-1/4'
                : 'basis-8'}"
            >
              <div class="w-full">
                <Collapsible
                  {proxy}
                  style="transparent"
                  size="sm"
                  defaultBtn={true}
                  {isOpen}
                >
                  <span slot="heading" class="pr-12">
                    {#if $isOpen}
                      <h6>Parameters</h6>
                    {/if}
                  </span>
                  {@const name = fn?.name}
                  {#if name}
                    <div
                      class="mb-4 mr-2 flex flex-wrap items-center space-x-1"
                    >
                      <button
                        on:click={() => navigator.clipboard.writeText(name)}
                        class="badge badge-secondary badge-outline h-full break-all"
                        title="Copy"
                      >
                        <span>{name}</span>
                        <Icon name="copy" size="xs" />
                      </button>
                      {#if fn.stateMutability === "payable"}
                        <div class="badge badge-outline badge-accent">
                          Payable
                        </div>
                      {/if}
                    </div>
                  {/if}
                </Collapsible>
              </div>
            </span>
          </MasterDetail>
        </div>
      {/if}
    {/if}
  {/if}
</div>
