<script lang="ts">
  import {
    nextSubscriber,
    type AnyCell,
    type MapCell,
  } from "@okcontract/cells";
  import { Icon, ThemeAccent, ThemeText, getTheme } from "@okcontract/uic";

  export let value: AnyCell<string>;

  export let placeholder: string = undefined;
  export let pattern: RegExp = undefined;
  export let disabled: boolean = undefined;
  export let valid: MapCell<true, false>;

  let hideError = true;
  nextSubscriber(value, (_) => (hideError = false));

  const theme = getTheme();
  const compiledTheme = theme?.compiled;
</script>

<label
  class="input input-bordered flex items-center gap-2 {disabled
    ? 'input-disabled'
    : ''} {theme.dark(
    $compiledTheme,
    'input-white-alpha',
    'input-black-alpha',
    '',
  )}{valid && $valid instanceof Error && !hideError ? ' input-error' : ''}"
  style={theme.apply($compiledTheme, [ThemeText])}
>
  <input
    {disabled}
    type="text"
    value={$value}
    {placeholder}
    required={pattern !== undefined}
    pattern={pattern && pattern.source}
    spellcheck={pattern ? false : true}
    on:input
    class="grow"
  />
  {#if !disabled && valid && !($valid instanceof Error) && $value !== ""}
    <div
      class="h-4 w-4
    {theme.dark($compiledTheme, 'text-white', 'text-black', 'text-success')}"
      style={theme.apply($compiledTheme, [ThemeText, ThemeAccent])}
    >
      <Icon name="check" size="xs" />
    </div>
  {/if}
</label>
