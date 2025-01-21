<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import {
    ContractType,
    type ChainAddress,
    type Network,
  } from "@okcontract/multichain";
  import { type OKPage } from "@okcontract/sdk";
  import { Button, Icon, QRCode, ThemeText, getTheme } from "@okcontract/uic";

  export let instance: OKPage;

  export let address: ChainAddress<Network> = null;
  export let addrStr = "";
  export let icon = false;
  export let style = false;
  export let qrCode = false;
  export let oneClick: [string, string] = undefined;
  export let removable = false;
  export let truncate = false;
  export let placeholder: string = "address...";
  export let my = true;
  export let link = false;
  export let isOpen: boolean = false;
  export let disabled = false;

  const theme = getTheme();
  const compiledTheme = theme?.compiled;

  // @todo real cell
  const addrStrCell = instance.proxy.new(addrStr);
  $: addrStrCell.set(addrStr);

  const addressCell = instance.proxy.new<ChainAddress<Network>>(undefined);
  $: addressCell.set(address);

  const addr = instance.proxy.map(
    [addressCell, addrStrCell],
    (_address, _addrStr) => _address?.addr?.toString() || _addrStr || "",
  );

  // @todo use findName
  const name = instance.null;
  const text = instance.proxy.map(
    [addr, instance.core.WalletID, name],
    (_addr, wallet, _name) =>
      my && _addr?.toString() === wallet?.toString()
        ? "My wallet"
        : _name
          ? _name
          : truncate
            ? _addr // @todo
            : _addr,
  );

  const isContract = instance.proxy.map(
    [addressCell, text],
    (_addr, _text) => _addr?.ty === ContractType && _text !== "My wallet",
  );
  const onInput = (ev: Event) => {
    addrStr = (ev.target as HTMLInputElement).value;
    dispatch("update", addrStr);
  };
</script>

{#if $addr instanceof Error}
  <span title={$addr.toString()}>Error</span>
  <!-- <AlertCellError cell={addr} /> -->
{:else if $isContract instanceof Error}
  <span title={$isContract.toString()}>Error</span>
{:else if !$addr}
  <input
    class="grow"
    style={theme.apply($compiledTheme, [ThemeText])}
    value={addrStr}
    {placeholder}
    {disabled}
    on:input={onInput}
  />
  {#if oneClick?.length}
    <Button
      label={oneClick[0]}
      size="xs"
      style="neutral"
      action={() => {
        addrStr = oneClick[1];
        dispatch("update", addrStr);
      }}
    />
  {/if}
{:else}
  <div class="flex-0 flex-col items-start">
    <div class="z-20 flex gap-1 items-center">
      <div
        class="flex gap-1 items-center {style
          ? `${theme.dark(
              $compiledTheme,
              $isContract ? 'btn btn-sm rounded-full btn-white-alpha' : '',
              $isContract
                ? 'btn btn-sm rounded-full btn-black-alpha'
                : 'btn-black-alpha',
              $isContract ? 'text-secondary' : 'text-primary',
            )}`
          : `${theme.dark($compiledTheme, 'btn-sm px-1 text-white', 'btn-sm px-1 text-black', 'text-secondary')}`}"
        style={theme.apply($compiledTheme, [ThemeText])}
      >
        {#if icon}
          <Icon name="wallet" size="xs" />
        {/if}
        <div class="truncate" title={$addr}>
          {$text}
        </div>
      </div>
      {#if address?.px}
        <button
          class="flex items-center btn btn-xs"
          title={`Proxy to ${address.px}`}
          on:click={() => {
            isOpen = !isOpen;
          }}
        >
          Proxy
          <Icon name="chevron-d" size="xs" opacity="70" />
        </button>
      {/if}
    </div>
    {#if address?.px}
      {#if isOpen}
        <div class="z-20 flex gap-1 pt-1 block items-center">
          <span class="text-xs opacity-70">Proxy to:</span>
          <svelte:self
            {instance}
            address={{ chain: address.chain, addr: address.px, px: undefined }}
            {icon}
            style={false}
            {link}
            {truncate}
          />
        </div>
      {/if}
    {/if}
  </div>

  {#if qrCode && $addr}
    <div class="flex shrink-0">
      <QRCode code={$addr} size={200} />
    </div>
  {/if}
  {#if addrStr && removable && !disabled}
    <div class="z-15 relative inset-y-0 right-0 ml-auto flex">
      <button
        class="h-full pl-1 border-transparent bg-transparent"
        on:click={() => {
          addrStr = "";
          dispatch("update", "");
        }}><Icon name="close-o" /></button
      >
    </div>
  {/if}
{/if}
