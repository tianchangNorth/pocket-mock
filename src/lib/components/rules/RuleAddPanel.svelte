<script lang="ts">
  import { addRule, groups } from '@/store/store';
  import { uiState } from '@/lib/stores/dashboard-store';
  import Button from '@/lib/ui/Button.svelte';
  import Input from '@/lib/ui/Input.svelte';
  import Select from '@/lib/ui/Select.svelte';
  import { showToast } from '@/lib/ui/toast-store';

  let newRuleUrl = "";
  let newRuleMethod = "GET";
  let newRuleGroupId = "";

  const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

  $: groupOptions = [
    { label: "No Group", value: "" },
    ...$groups.map(g => ({ label: g.name, value: g.id }))
  ];

  function handleAddRule() {
    if (!newRuleUrl) {
      showToast("Please enter URL", "warning");
      return;
    }
    addRule(newRuleUrl, newRuleMethod, undefined, 0, 200, newRuleGroupId || undefined);
    uiState.setAddRulePanel(false);
    newRuleUrl = "";
    newRuleMethod = "GET";
    newRuleGroupId = "";
  }
</script>

<div class="add-panel">
  <div class="form-row">
    <div style="width: 80px;">
      <Select bind:value={newRuleMethod} options={METHODS} />
    </div>
    {#if $groups.length > 0}
      <div style="width: 120px;">
        <Select bind:value={newRuleGroupId} options={groupOptions} />
      </div>
    {/if}
    <div style="flex: 1;">
      <Input placeholder="/api/path" bind:value={newRuleUrl} />
    </div>
  </div>
  <div class="form-actions">
    <Button size="sm" on:click={() => uiState.setAddRulePanel(false)}>Cancel</Button>
    <Button size="sm" variant="primary" on:click={handleAddRule}>Add Rule</Button>
  </div>
</div>

<style>
  .add-panel {
    background: var(--pm-bg-tertiary);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid var(--pm-border);
  }

  .form-row {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
