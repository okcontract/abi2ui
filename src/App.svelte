<script lang="ts">
  import { OKCore } from "@okcontract/sdk";

  import BgImg from "./assets/bg-popart.png";
  import OkLogo from "./assets/okcontract-logo.svg";
  export let core: OKCore;
  const walletAccount = core.WantedWalletAccount;
</script>

<div>
  <nav
    class="navbar flex justify-between w-full md:gap-1 lg:gap-2 sticky top-0 left-0 right-0 h-16 px-4 bg-base-200 text-base-content bg-opacity-90 backdrop-blur z-30"
  >
    <div class="flex flex-1 md:gap-1 lg:gap-2">
      <img src={OkLogo} class="h-10 w-10" alt="OKcontract Logo" />
      <span class="text-xl font-semibold">Pilot</span>
    </div>
    <nav class="menu menu-horizontal gap-3">
      <li><a>About</a></li>
      <li><a>Chat</a></li>
      <li><a>Leaderboard</a></li>
    </nav>
    <div class="flex">
      {#if $walletAccount}
        {$walletAccount}
      {:else}
        <button class="btn btn-md bg-accent text-neutral-content rounded-full"
          >Connect wallet</button
        >
      {/if}
    </div>
  </nav>
  <main class="min-h-screen justify-center w-full">
    <div class="relative w-full">
      <picture class="absolute top-0 left-0 h-full right-0">
        <img class="block w-full" src={BgImg} alt="bg" />
      </picture>
      <div class="p-8 max-w-3xl mx-auto">
        <div
          class="card bg-base-100 text-base-content p-8 grid gap-3 border-2 border-neutral"
        >
          <h6 class="uppercase">Step 1</h6>
          <h1 class="text-5xl font-semibold mb-2">
            <img class="block w-full" src="./assets/shape-001.svg" alt="" />
            Why Otopilot?
          </h1>
          <h2 class="mb-3 text-3xl font-semibold">
            DeFi offers yields, but interacting with protocols is hard
          </h2>
          <ul class="list-disc ml-6 mb-6">
            <li>involves redundant tasks</li>
            <li>running multi-step yield loops by hand</li>
            <li>juggling wallets and dApps</li>
          </ul>

          <h2 class="mb-3 text-3xl font-semibold">
            Otopilot is a yield earning agent
          </h2>
          <ul class="list-disc ml-6 mb-6">
            <li>manages a dedicated Safe smart account</li>
            <li>finds yields on blue chip protocols</li>
            <li>interacts with protocols to earn yields</li>
          </ul>
          <button class="btn btn-lg bg-accent text-neutral-content rounded-full"
            >Connect wallet</button
          >
        </div>
      </div>
    </div>

    <footer class="footer footer-center gap-4 text-base-content items-center">
      <nav class="grid-flow-col place-self-center"></nav>
      <aside class="grid-flow-col items-center gap-2">
        <p>
          Built by <a
            href="https://okcontract.com"
            target="_blank"
            rel="noreferrer"
            class="link link-primary">OKcontract</a
          > team
        </p>
      </aside>
    </footer>
  </main>
</div>
