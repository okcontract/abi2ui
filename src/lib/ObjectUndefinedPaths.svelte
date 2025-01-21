<script lang="ts">
  import { type Key } from "@okcontract/cells";
  import {
    DataEditor,
    type EditorNode,
    type LabelledTypeDefinition,
  } from "@okcontract/fred";
  import { Button, CustomSelect, Icon } from "@okcontract/uic";

  export let editor: DataEditor;
  export let parent: EditorNode;
  export let nodes: EditorNode[];

  type UndefinedDefinition = {
    key: string;
    icon: string;
    label: string;
    id: number;
  };

  const values = nodes
    .map(
      (node, i) =>
        // definition is not reactive but block is keyed
        [node.definition.value, i] as [LabelledTypeDefinition, number],
    )
    .filter(([def]) => !("hidden" in def && def.hidden))
    .map(
      ([def, i]) =>
        ({
          key: nodes[i].key,
          icon: "icon" in def ? def.icon : undefined,
          label: def.label,
        }) as UndefinedDefinition,
    );

  const onChange = (ev: { detail: Key }) =>
    editor.addNewProperty(parent, ev.detail);
</script>

{#if values instanceof Error}
  Error: undefined paths ({values})
{:else if values?.length === 1}
  <Button
    style="neutral"
    outline={true}
    label={`Add ${values[0]?.label || values[0].key}`}
    action={() => onChange({ detail: values[0].key })}
  />
{:else if values?.length}
  <CustomSelect {values} on:change={onChange}>
    <Icon name="add" size="sm" /><span
      title={values.map((v) => v.label).join(" or ")}>Add Optional Field</span
    >
  </CustomSelect>
{/if}
