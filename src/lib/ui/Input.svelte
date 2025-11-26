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
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    color: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s;
  }

  .pm-input:focus {
    border-color: #646cff;
    background: #333;
  }

  .pm-input::placeholder {
    color: #666;
  }
</style>
