<script lang="ts">
  export let value: string;
  export let options: string[] = [];
  export let id: string = "";
</script>

<div class="pm-select-wrapper">
  <select bind:value class="pm-select" {id}>
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
  <svg class="pm-select-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>

<style>
  .pm-select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .pm-select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 8px 32px 8px 12px;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    color: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s;
  }

  .pm-select:focus {
    border-color: #646cff;
    background: #333;
  }

  .pm-select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
</style>
