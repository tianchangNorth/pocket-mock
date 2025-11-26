<script lang="ts">
  export let checked: boolean = false;
  export let onChange: (checked: boolean) => void = () => {};

  function toggle() {
    checked = !checked;
    onChange(checked);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="pm-switch" class:checked on:click={toggle}>
  <div class="pm-switch-thumb"></div>
</div>

<style>
  .pm-switch {
    width: 36px;
    height: 20px;
    background: #3a3a3a;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
  }

  .pm-switch.checked {
    background: #646cff;
  }

  .pm-switch-thumb {
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  .pm-switch.checked .pm-switch-thumb {
    transform: translateX(16px);
  }
</style>
