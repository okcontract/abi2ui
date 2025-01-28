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
  const query = proxy.new("tok:op" as ContractQueryType);
  const chain = proxy.new(optimism.id);
  const contract = new OKContract(page, query, chain);

  const addr = contract.address;

  const chains = core.Chains;
  const walletAccount = core.WantedWalletAccount;

  let input: ContractQueryType;
  $: input = $query;
</script>

<main class="container mx-auto">
  <div class="mt-4 navbar bg-base-200 rounded-box px-4">
    <div class="flex flex-1 md:gap-1 lg:gap-2">
      <img src={OkLogo} class="h-10 w-10" alt="OKcontract Logo" />
      <span class="text-xl font-semibold">OKcontract ABI2UI</span>
    </div>
    <div class="flex-0">
      {#if $walletAccount}
        {$walletAccount}
      {:else}
        <Button
          style="neutral"
          label="Connect Wallet"
          asyncAction={() => core.Connect()}
        />
      {/if}
    </div>
  </div>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-semibold mb-2">ABI2UI</h1>
    <p>
      This is a demo of compiler that automatically generates user-friendly
      inputs from the contracts ABI definitions.
    </p>
  </div>

  <div>
    {#if $chains}
      {#if $addr && !($addr instanceof Error)}
        <div class="p-4 w-full">
         <input bind:value={input} />
  <button
    on:click={() => {
      query.set(input);
    }}>Go</button
  >
          <p>
            <span class="font-semibold">Contract address:</span>
            {$addr.addr.toString()}
          </p>
          <p><span class="font-semibold">Chain:</span> {$addr.chain}</p>
        </div>
      {/if}
      <div class="mb-4 card bordered">
        <AbiView instance={page} {contract} {query} />
      </div>
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
