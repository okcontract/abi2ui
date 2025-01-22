<script lang="ts">
  import { optimism } from "@okcontract/multichain";
  import {
    OKContract,
    OKCore,
    OKPage,
    type ContractQueryType,
  } from "@okcontract/sdk";
  import { Button } from "@okcontract/uic";

  import GithubLogo from "./assets/github-logo.svg";
  import OkLogo from "./assets/okcontract-logo.svg";

  import AbiView from "./lib/ABIView.svelte";

  export let core: OKCore;

  const page = new OKPage(core);
  const proxy = page.proxy;
  const query = proxy.new("con:velodrome/router_optimism" as ContractQueryType);
  const chain = proxy.new(optimism.id);
  const contract = new OKContract(page, query, chain);

  const chains = core.Chains;
  const walletAccount = core.WantedWalletAccount;

  let input: ContractQueryType;
  $: input = $query;
</script>

<main class="container mx-auto">
  <div class="mt-4 navbar bg-base-200 gap-2 rounded-box px-4">
    <img src={OkLogo} class="h-10 w-10" alt="OKcontract Logo" />
    <span class="text-xl font-semibold">OKcontract ABI2UI</span>
  </div>
  <div class="p-4 prose w-full">
    <h1>ABI2UI</h1>
    <p>
      This is a demo of compiler that automatically generates user-friendly
      inputs from the contracts ABI definitions.
    </p>
  </div>

  {#if $walletAccount}
    {$walletAccount}
  {:else}
    <Button style="accent" label="Connect Wallet" action={core.Connect} />
  {/if}

  <input bind:value={input} />
  <button
    on:click={() => {
      query.set(input);
    }}>Go</button
  >

  <div class="mb-4 card bordered">
    {#if $chains}
      {#key $query}
        <AbiView instance={new OKPage(core)} {contract} {query} />
      {/key}
    {/if}
  </div>

  <footer
    class="footer footer-center gap-4 bg-base-200 text-base-content items-center p-4 rounded-box"
  >
    <nav class="grid-flow-col place-self-center">
      <a
        href="https://github.com/okcontract"
        target="_blank"
        rel="noreferrer"
        class=""><img src={GithubLogo} class="h-6 w-6" alt="Github" /></a
      >
    </nav>
    <aside class="grid-flow-col items-center gap-2">
      <p>
        This library was built by the <a
          href="https://okcontract.com"
          target="_blank"
          rel="noreferrer"
          class="link link-primary">OKcontract</a
        >
        team with the support from the
        <a
          href="https://www.optimism.io/"
          target="_blank"
          rel="noreferrer"
          class="link link-primary">Optimism</a
        > RFG grant
      </p>
    </aside>
  </footer>
</main>

<style>
  h4 {
    font-weight: bold;
  }
</style>
