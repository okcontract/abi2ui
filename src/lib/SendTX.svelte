<script lang="ts">
  import type {
    AnyContractQuery,
    OKPage,
    OKTransaction,
  } from "@okcontract/sdk";
  import {
    Button,
    SimpleModal,
    ThemeButton,
    ThemeText,
    getTheme,
  } from "@okcontract/uic";

  const theme = getTheme();
  const compiledTheme = theme?.compiled;

  export let instance: OKPage;
  const core = instance.core;
  const proxy = instance.proxy;

  const isConnectWallet = core.IsConnectWallet;
  const noWallet = core.IsNoWallet;
  const conn = core.Connector;
  const connChains = proxy.map([conn], (conn) => conn.Chains);

  export let okTX: OKTransaction<AnyContractQuery>;
  const isSending = okTX.isSending;
  const chain = okTX.chain;
  const contractChain = okTX.contractChain;

  const connHasChain = proxy.map(
    [connChains, contractChain],
    (sup, ch) => !!sup[ch],
  );

  /** button label */
  export let label: string;
  /** button disabled */
  export let disabled: boolean;

  const SwitchChain = proxy.mapNoPrevious(
    [core.IsConnectWallet, core.CurrentChain, okTX.contractChain],
    (w, cur, con) => !w && cur !== con,
    "SwitchChain",
  );
  // @todo Catching cells...
  const Label = proxy.mapNoPrevious(
    [noWallet, isConnectWallet, SwitchChain, chain, connHasChain],
    (n, w, s, ch, cch) =>
      n || w
        ? "Connect Wallet"
        : !cch
          ? "Change Wallet"
          : s && ch
            ? `Switch to ${ch?.name}`
            : label,
    "Label",
  );

  const showNoWallet = proxy.new(false, "showNoWallet");
</script>

<Button
  label={!($Label instanceof Error) && $Label ? $Label : label}
  disabled={$isConnectWallet instanceof Error ||
    $SwitchChain instanceof Error ||
    $contractChain instanceof Error ||
    (!$SwitchChain && !$isConnectWallet && disabled) ||
    !$connHasChain}
  working={isSending}
  asyncAction={async () => {
    if ($noWallet === true) {
      showNoWallet.set(true);
      return;
    }
    if ($isConnectWallet) {
      await core.Connect();
      return;
    }
    if ($SwitchChain && !($contractChain instanceof Error)) {
      await core.SwitchChain($contractChain);
      return;
    }
    await okTX.sendTX();
  }}
  size="md"
  block={true}
  addAsyncSpin={true}
  thParts={[ThemeText, ThemeButton]}
  style={theme.dark(
    $compiledTheme instanceof Error ? null : $compiledTheme,
    "default",
    "neutral",
    "neutral",
  )}
/>

<SimpleModal isOpen={showNoWallet} closeBtn={true} btmAct={false}>
  No Wallet
</SimpleModal>
