<script lang="ts">
  import { rules, toggleRule, updateRuleResponse, addRule, deleteRule, updateRuleDelay, updateRuleStatus, updateRuleHeaders, updateRuleMethod, updateRuleUrl } from '../core/store';
  import { requestLogs } from '../core/log-store';
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Select from './ui/Select.svelte';
  import Switch from './ui/Switch.svelte';
  
  // Control panel expand/collapse
  let minimized = false;
  // Currently editing rule ID
  let editingId: string | null = null;
  // Temporary edit content strings
  let editContent = "";
  let editHeadersContent = "";
  let editUrl = "";
  let editMethod = "GET";
  let editStatus: string = "200";
  let editDelay: string = "0";
  
  let activeTab: 'body' | 'headers' | 'config' = 'body';
  
  // Main tab status
  let activeMainTab: 'rules' | 'network' = 'rules';

  // New rule status
  let showAddPanel = false;
  let newRuleUrl = "";
  let newRuleMethod = "GET";

  const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

  function handleAddRule() {
    if (!newRuleUrl) {
      alert("Please enter URL");
      return;
    }
    addRule(newRuleUrl, newRuleMethod);
    showAddPanel = false;
    newRuleUrl = "";
    newRuleMethod = "GET";
  }

  function startEdit(rule: any) {
    editingId = rule.id;
    activeTab = 'body';
    // Format JSON with 2-space indent
    editContent = JSON.stringify(rule.response, null, 2);
    editHeadersContent = JSON.stringify(rule.headers || {}, null, 2);
    editUrl = rule.url;
    editMethod = rule.method;
    editStatus = String(rule.status || 200);
    editDelay = String(rule.delay || 0);
  }

  function saveEdit() {
    if (editingId) {
      const successBody = updateRuleResponse(editingId, editContent);
      const successHeaders = updateRuleHeaders(editingId, editHeadersContent);
      
      if (successBody && successHeaders) {
        // Save other fields
        updateRuleUrl(editingId, editUrl);
        updateRuleMethod(editingId, editMethod);
        updateRuleStatus(editingId, parseInt(editStatus) || 200);
        updateRuleDelay(editingId, parseInt(editDelay) || 0);

        editingId = null; // Exit edit mode
      } else {
        alert("Invalid JSON format, please check Body or Headers!");
      }
    }
  }

  function cancelEdit() {
    editingId = null;
  }
</script>

<div class="container" class:minimized={minimized}>
  <div class="header">
    <div class="title-area">
      <h3>PocketMock</h3>
      {#if minimized && $rules.length > 0}
        <span class="rule-count">{$rules.length}</span>
      {/if}
      {#if !minimized}
        <div class="add-btn-wrapper" class:visible={activeMainTab === 'rules'}>
          <Button size="sm" variant="ghost" icon on:click={() => showAddPanel = !showAddPanel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </Button>
        </div>
      {/if}
    </div>
    
    <button class="toggle-btn" on:click={() => minimized = !minimized} title={minimized ? 'Expand panel' : 'Collapse panel'}>
      {#if minimized}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 5h6v2H3z"/>
        </svg>
      {:else}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 7l3-3 3 3z"/>
        </svg>
      {/if}
    </button>
  </div>

  {#if !minimized}
    <div class="main-tabs">
      <button class="main-tab-btn" class:active={activeMainTab === 'rules'} on:click={() => activeMainTab = 'rules'}>Rules</button>
      <button class="main-tab-btn" class:active={activeMainTab === 'network'} on:click={() => activeMainTab = 'network'}>Network</button>
    </div>
  {/if}

  {#if !minimized}
    <div class="content">
      {#if activeMainTab === 'rules'}
        {#if showAddPanel}
          <div class="add-panel">
            <div class="form-row">
              <div style="width: 100px;">
                <Select bind:value={newRuleMethod} options={METHODS} />
              </div>
              <div style="flex: 1;">
                <Input placeholder="/api/path" bind:value={newRuleUrl} />
              </div>
            </div>
            <div class="form-actions">
              <Button size="sm" on:click={() => showAddPanel = false}>Cancel</Button>
              <Button size="sm" variant="primary" on:click={handleAddRule}>Add Rule</Button>
            </div>
          </div>
        {/if}

        {#if $rules.length === 0 && !showAddPanel}
          <div class="empty-state">
            <div class="empty-icon">👋</div>
            <p>No active rules</p>
            <p class="sub-text">Click the + button above to mock your first API</p>
          </div>
        {:else}
          {#each $rules as rule (rule.id)}
            <div class="card" class:editing={editingId === rule.id}>
              {#if editingId === rule.id}
                <!-- Edit Mode -->
                <div class="editor-container">
                  <div class="editor-header">
                    <div class="editor-tabs" role="tablist">
                      <button
                        role="tab"
                        id="config-tab"
                        class:active={activeTab === 'config'}
                        aria-selected={activeTab === 'config'}
                        on:click={() => activeTab = 'config'}
                        on:keydown={(e) => {
                          if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'body' : activeTab === 'body' ? 'headers' : 'config';
                          } else if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'headers' : activeTab === 'body' ? 'config' : 'body';
                          }
                        }}
                      >Config</button>
                      <button
                        role="tab"
                        id="body-tab"
                        class:active={activeTab === 'body'}
                        aria-selected={activeTab === 'body'}
                        on:click={() => activeTab = 'body'}
                        on:keydown={(e) => {
                          if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'body' : activeTab === 'body' ? 'headers' : 'config';
                          } else if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'headers' : activeTab === 'body' ? 'config' : 'body';
                          }
                        }}
                      >Body</button>
                      <button
                        role="tab"
                        id="headers-tab"
                        class:active={activeTab === 'headers'}
                        aria-selected={activeTab === 'headers'}
                        on:click={() => activeTab = 'headers'}
                        on:keydown={(e) => {
                          if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'body' : activeTab === 'body' ? 'headers' : 'config';
                          } else if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            activeTab = activeTab === 'config' ? 'headers' : activeTab === 'body' ? 'config' : 'body';
                          }
                        }}
                      >Headers</button>
                    </div>
                    <div class="editor-actions">
                       <Button size="sm" variant="danger" icon on:click={() => {
                          deleteRule(rule.id);
                          editingId = null;
                       }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                       </Button>
                    </div>
                  </div>

                  <div class="editor-content">
                    {#if activeTab === 'config'}
                      <div class="config-grid" role="tabpanel" aria-labelledby="config-tab">
                         <div class="field-group">
                            <label for="method-select">Method</label>
                            <Select bind:value={editMethod} options={METHODS} id="method-select" />
                         </div>
                         <div class="field-group url-group">
                            <label for="url-input">URL Pattern</label>
                            <Input bind:value={editUrl} id="url-input" />
                         </div>
                         <div class="field-group">
                            <label for="status-input">Status</label>
                            <Input type="number" bind:value={editStatus} id="status-input" />
                         </div>
                         <div class="field-group">
                            <label for="delay-input">Delay (ms)</label>
                            <Input type="number" bind:value={editDelay} id="delay-input" />
                         </div>
                      </div>
                    {:else if activeTab === 'body'}
                      <textarea
                        class="code-editor"
                        bind:value={editContent}
                        placeholder="Response Body JSON"
                        role="tabpanel"
                        aria-labelledby="body-tab"
                      ></textarea>
                    {:else}
                      <textarea
                        class="code-editor"
                        bind:value={editHeadersContent}
                        placeholder="Response Headers JSON"
                        role="tabpanel"
                        aria-labelledby="headers-tab"
                      ></textarea>
                    {/if}
                  </div>

                  <div class="editor-footer">
                    <Button size="sm" on:click={cancelEdit}>Cancel</Button>
                    <Button size="sm" variant="primary" on:click={saveEdit}>Save Changes</Button>
                  </div>
                </div>
              {:else}
                <!-- Preview Mode -->
                <div
                  class="card-header"
                  role="button"
                  tabindex="0"
                  aria-label="Edit rule {rule.method} {rule.url}"
                  on:click={() => startEdit(rule)}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      startEdit(rule);
                    }
                  }}
                >
                  <div class="badges">
                    <span class="badge method" class:GET={rule.method === 'GET'} class:POST={rule.method === 'POST'} class:PUT={rule.method === 'PUT'} class:DELETE={rule.method === 'DELETE'}>{rule.method}</span>
                    <span class="url" title={rule.url}>{rule.url}</span>
                  </div>
                  <div class="header-actions" role="button" tabindex="-1" on:click|stopPropagation on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleRule(rule.id);
                    }
                  }}>
                    <Switch checked={rule.enabled} onChange={() => toggleRule(rule.id)} />
                  </div>
                </div>
                <div
                  class="card-meta"
                  role="button"
                  tabindex="0"
                  aria-label="Edit rule configuration"
                  on:click={() => startEdit(rule)}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      startEdit(rule);
                    }
                  }}
                >
                   <span class="meta-item">Status: <b>{rule.status}</b></span>
                   <span class="meta-item">Delay: <b>{rule.delay}ms</b></span>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      {:else if activeMainTab === 'network'}
        <div class="network-logs">
          {#if $requestLogs.length === 0}
            <div class="empty-state">
              <p>No request records</p>
            </div>
          {:else}
            {#each $requestLogs as log (log.id)}
              <div class="log-item">
                <div class="log-header">
                  <span class="status-badge" class:success={log.status >= 200 && log.status < 300} class:error={log.status >= 400}>{log.status}</span>
                  <span class="method-badge">{log.method}</span>
                  <span class="log-url" title={log.url}>{log.url}</span>
                </div>
                <div class="log-meta">
                  <span class="duration">{log.duration}ms</span>
                  <span class="time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Reset & Base */
  * { box-sizing: border-box; }

  .container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 400px;
    background: #1a1a1a;
    color: #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    height: 600px;
    max-height: 85vh;
    z-index: 99999;
    overflow: hidden;
  }

  .container.minimized {
    width: auto;
    min-width: 140px;
    height: auto;
    background: #2a2a2a;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    min-height: 48px; /* Fixed minimum height */
  }

  .title-area {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 24px; /* Ensure consistent title area height */
  }

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .rule-count {
    background: #333;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 11px;
    color: #888;
  }

  .add-btn-wrapper {
    min-width: 32px; /* Ensure consistent width */
    min-height: 24px; /* Ensure consistent height */
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  .add-btn-wrapper.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .toggle-btn {
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
  }

  .toggle-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }

  /* Tabs */
  .main-tabs {
    display: flex;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    height: 44px; /* Fixed height for tab bar */
    box-sizing: border-box;
  }

  .main-tab-btn {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-tab-btn:hover {
    color: #bbb;
  }

  .main-tab-btn.active {
    color: #646cff;
    border-bottom-color: #646cff;
  }

  /* Content */
  .content {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }

  /* Add Panel */
  .add-panel {
    background: #252525;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid rgba(255,255,255,0.05);
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

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .sub-text {
    font-size: 12px;
    margin-top: 4px;
    color: #444;
  }

  /* Card */
  .card {
    background: #252525;
    border-radius: 8px;
    margin-bottom: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    transition: transform 0.2s, border-color 0.2s;
    overflow: hidden;
  }

  .card:hover {
    border-color: rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  .card.editing {
    border-color: #646cff;
    transform: none;
  }

  /* Preview Mode */
  .card-header {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .badges {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0; /* enable text truncation */
  }

  .url {
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ccc;
  }

  .card-meta {
    padding: 0 12px 12px;
    font-size: 11px;
    color: #666;
    display: flex;
    gap: 12px;
    cursor: pointer;
  }

  .card-meta b {
    color: #888;
    font-weight: normal;
  }

  /* Editor Mode */
  .editor-container {
    background: #2a2a2a;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(0,0,0,0.2);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .editor-tabs {
    display: flex;
    gap: 4px;
  }

  .editor-tabs button {
    background: transparent;
    border: none;
    color: #666;
    padding: 4px 8px;
    font-size: 11px;
    cursor: pointer;
    border-radius: 4px;
  }

  .editor-tabs button:hover {
    color: #ccc;
    background: rgba(255,255,255,0.05);
  }

  .editor-tabs button.active {
    color: #fff;
    background: rgba(255,255,255,0.1);
    font-weight: 500;
  }

  .editor-content {
    padding: 12px;
  }

  .config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .url-group {
    grid-column: span 2;
  }

  .field-group label {
    display: block;
    font-size: 11px;
    color: #666;
    margin-bottom: 4px;
  }

  .code-editor {
    width: 100%;
    min-height: 150px;
    background: #151515;
    border: 1px solid #333;
    border-radius: 4px;
    color: #a5d6ff;
    font-family: 'Menlo', 'Monaco', monospace;
    font-size: 12px;
    padding: 8px;
    resize: vertical;
    outline: none;
  }

  .code-editor:focus {
    border-color: #646cff;
  }

  .editor-footer {
    padding: 10px 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(0,0,0,0.2);
  }

  /* Badges */
  .badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .method.GET { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
  .method.POST { background: rgba(5, 150, 105, 0.2); color: #34d399; }
  .method.PUT { background: rgba(217, 119, 6, 0.2); color: #fbbf24; }
  .method.DELETE { background: rgba(220, 38, 38, 0.2); color: #f87171; }

  /* Logs */
  .network-logs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .log-item {
    background: #252525;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .log-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .status-badge {
    font-family: monospace;
    font-weight: bold;
  }
  .status-badge.success { color: #34d399; }
  .status-badge.error { color: #f87171; }

  .log-url {
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .log-meta {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 11px;
  }
</style>