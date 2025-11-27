<script lang="ts">
  export let value: string = "";
  export let placeholder: string = "";
  export let type: "text" | "number" = "text";
  export let id: string = "";
</script>

{#if type === "number"}
  <input
    type="number"
    bind:value
    {placeholder}
    {id}
    class="pm-input"
  />
{:else}
  <input
    type="text"
    bind:value
    {placeholder}
    {id}
    class="pm-input"
  />
{/if}

<style>
  .pm-input {
    width: 100%;
    padding: 8px 12px;
    background: var(--pm-input-bg, #2a2a2a);
    border: 1px solid var(--pm-border, #3a3a3a);
    border-radius: 4px;
    color: var(--pm-text-primary, #fff);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s;
  }

  .pm-input:focus {
    border-color: var(--pm-primary, #646cff);
    background: var(--pm-input-bg-focus, #333);
  }

  .pm-input::placeholder {
    color: var(--pm-text-placeholder, #666);
  }

  /* Hide spinner/stepper for number inputs */
  .pm-input[type="number"]::-webkit-inner-spin-button,
  .pm-input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .pm-input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
