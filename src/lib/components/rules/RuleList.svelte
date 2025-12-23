<script lang="ts">
  import { rules, groups, addGroup } from '@/store/store';
  import { uiState } from '@/lib/stores/dashboard-store';
  import RuleItem from './RuleItem.svelte';
  import GroupItem from './GroupItem.svelte';
  import RuleFilter from './RuleFilter.svelte';
  import RuleAddPanel from './RuleAddPanel.svelte';
  import Button from '@/lib/ui/Button.svelte';

  $: filteredRules = $rules.filter(rule => {
    const matchText = rule.url.toLowerCase().includes($uiState.ruleFilterText.toLowerCase());
    const matchMethod = $uiState.ruleMethodFilter === "ALL" || rule.method === $uiState.ruleMethodFilter;
    const matchStatus = $uiState.ruleStatusFilter === "ALL" 
      ? true 
      : $uiState.ruleStatusFilter === "ENABLED" ? rule.enabled : !rule.enabled;
    return matchText && matchMethod && matchStatus;
  });

  $: groupedRulesMap = $groups.reduce((acc, group) => {
    acc[group.id] = filteredRules.filter(r => r.groupId === group.id);
    return acc;
  }, {} as Record<string, typeof filteredRules>);

  $: ungroupedRules = filteredRules.filter(r => !r.groupId || !$groups.find(g => g.id === r.groupId));

  function clearFilters() {
    uiState.resetRuleFilters();
  }

  function handleAddGroup() {
    addGroup('New Group');
  }
</script>

{#if $uiState.showAddRulePanel}
  <RuleAddPanel />
{/if}

{#if $rules.length > 0 || $groups.length > 0}
  <div class="list-toolbar">
    <div class="filter-wrapper">
      <RuleFilter />
    </div>
    <div class="add-group-btn">
      <Button icon on:click={handleAddGroup} title="Add New Group">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
      </Button>
    </div>
  </div>
{/if}

{#if $rules.length === 0 && $groups.length === 0 && !$uiState.showAddRulePanel}
  <div class="empty-state">
    <div class="empty-icon">👋</div>
    <p>No active rules</p>
    <p class="sub-text">Click the + button above to mock your first API</p>
  </div>
{:else if filteredRules.length === 0 && $groups.length === 0 && !$uiState.showAddRulePanel}
    <div class="empty-state">
    <p>No matching rules found</p>
    <Button size="sm" variant="ghost" on:click={clearFilters}>Clear Filters</Button>
  </div>
{:else}
  {#each $groups as group (group.id)}
    <GroupItem {group} rules={groupedRulesMap[group.id] || []} />
  {/each}

  {#each ungroupedRules as rule (rule.id)}
    <RuleItem {rule} />
  {/each}
{/if}

<style>
  .list-toolbar {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .filter-wrapper {
    flex: 1;
  }

  .add-group-btn {
    padding-top: 2px;
  }

  :global(.list-toolbar .rule-toolbar) {
    margin-bottom: 0 !important;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--pm-text-secondary);
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .sub-text {
    font-size: 12px;
    margin-top: 4px;
    color: var(--pm-text-secondary);
    opacity: 0.8;
  }
</style>
