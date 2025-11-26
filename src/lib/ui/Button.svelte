<script lang="ts">
  export let variant: "primary" | "secondary" | "danger" | "ghost" = "secondary";
  export let size: "sm" | "md" = "md";
  export let icon: boolean = false;
</script>

<button class="pm-btn {variant} {size}" class:icon on:click>
  <slot />
</button>

<style>
  .pm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
    box-sizing: border-box;
  }

  /* Sizes */
  .pm-btn.md {
    height: 32px;
    padding: 0 16px;
    font-size: 13px;
  }

  .pm-btn.sm {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
  }

  .pm-btn.icon {
    padding: 0;
    width: 32px; /* Match md height */
  }
  .pm-btn.sm.icon {
    width: 24px;
  }

  /* Variants */
  .pm-btn.primary {
    background: #646cff;
    color: white;
  }
  .pm-btn.primary:hover {
    background: #747bff;
  }

  .pm-btn.secondary {
    background: #3a3a3a;
    color: #e0e0e0;
    border: 1px solid transparent;
  }
  .pm-btn.secondary:hover {
    background: #4a4a4a;
    color: white;
  }

  .pm-btn.danger {
    background: rgba(255, 70, 70, 0.1);
    color: #ff4646;
    border: 1px solid transparent;
  }
  .pm-btn.danger:hover {
    background: rgba(255, 70, 70, 0.2);
    border-color: rgba(255, 70, 70, 0.3);
  }

  .pm-btn.ghost {
    background: transparent;
    color: #888;
  }
  .pm-btn.ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
</style>
