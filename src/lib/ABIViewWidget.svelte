<script lang="ts">
  import { cellify } from "@okcontract/cells";
  import { VIEW } from "@okcontract/fred";
  import {
    OKContractManager,
    Stepper,
    widgetTypeScheme,
    type AnyContractQuery,
    type OKPage,
  } from "@okcontract/sdk";
  import { Loading } from "@okcontract/uic";

  import WidgetTx from "./WidgetTX.svelte";

  export let instance: OKPage;
  export let okc: OKContractManager | undefined = undefined;
  export let method: string;
  export let query: AnyContractQuery;

  const proxy = instance.proxy;
  const recomputer = instance.proxy.new(0);
</script>

{#await instance.newInteraction(widgetTypeScheme(instance, VIEW), query, method)}
  <div class="w-full text-center py-8">
    <Loading />
  </div>
{:then widget}
  {@const stepper = new Stepper(instance, cellify(proxy, widget.OKWidget.st), {
    forceTXGeneration: false,
    recomputer,
    okc,
  })}
  <WidgetTx {instance} {stepper} hideLabels={false} />
{/await}
