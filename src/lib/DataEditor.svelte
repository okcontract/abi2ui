<script lang="ts">
  import { DataEditor } from "@okcontract/fred";
  import type { OKPage } from "@okcontract/sdk";

  import type { EditorOptions } from "../types";
  import EditorNodeCell from "./EditorNodeCell.svelte";

  // @todo create instance here?
  export let instance: OKPage;
  export let editor: DataEditor;
  export let options: EditorOptions = {};
</script>

<EditorNodeCell {instance} {editor} node={editor.root} {options} />
