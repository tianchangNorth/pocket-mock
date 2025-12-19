<script lang="ts">
  import type { NetworkDetailTab } from '@/lib/stores/dashboard-store';
  import JsonEditor from '@/lib/ui/JsonEditor.svelte';
  
  export let log: any;
  export let activeTab: NetworkDetailTab = 'response';
  export let onTabChange: (tab: NetworkDetailTab) => void;

  function formatJson(str: any): string {
    if (!str) return '';
    try {
      if (typeof str === 'string') {
        const obj = JSON.parse(str);
        return JSON.stringify(obj, null, 2);
      }
      return JSON.stringify(str, null, 2);
    } catch (e) {
      return String(str);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="log-details" on:click|stopPropagation>
  <div class="detail-header">
    <div class="detail-tabs">
      <button
        class="tab-button"
        class:active={activeTab === 'headers'}
        on:click|stopPropagation={() => onTabChange('headers')}
      >
        Headers
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'payload'}
        on:click|stopPropagation={() => onTabChange('payload')}
      >
        Payload
      </button>
      <button
        class="tab-button"
        class:active={activeTab === 'response'}
        on:click|stopPropagation={() => onTabChange('response')}
      >
        Response
      </button>
    </div>
  </div>

  <div class="detail-content">
    {#if activeTab === 'headers'}
      <div class="detail-section">
        <div class="editor-wrapper">
          <JsonEditor value={formatJson(log.requestHeaders)} readonly={true} height="auto" maxHeight="400px" lineNumbers={false} />
        </div>
      </div>
    {:else if activeTab === 'payload'}
      <div class="detail-section">
        <div class="editor-wrapper">
          <JsonEditor value={formatJson(log.requestPayload)} readonly={true} height="auto" maxHeight="400px" lineNumbers={false} />
        </div>
      </div>
    {:else if activeTab === 'response'}
      <div class="detail-section">
        <div class="editor-wrapper">
          <JsonEditor value={formatJson(log.responseBody)} readonly={true} height="auto" maxHeight="400px" lineNumbers={false} />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .log-details {
    display: flex;
    flex-direction: column;
    height: 100%;
    cursor: auto;
    background-color: var(--pm-bg);
    border-top: 1px solid var(--pm-border);
  }

  .detail-header {
    border-bottom: 1px solid var(--pm-border);
    padding: 0 12px;
    background-color: var(--pm-bg-secondary);
  }

  .detail-tabs {
    display: flex;
    gap: 16px;
  }

  .tab-button {
    background: transparent;
    border: none;
    color: var(--pm-text-secondary);
    padding: 10px 4px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    transition: color 0.2s ease;
  }

  .tab-button:hover {
    color: var(--pm-text-primary);
  }

  .tab-button.active {
    color: var(--pm-primary);
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--pm-primary);
    border-radius: 2px 2px 0 0;
  }

  .detail-content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .detail-section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .editor-wrapper {
    flex: 1;
    overflow: hidden;
    /* Remove border to blend in */
    border: none;
    border-radius: 0;
  }

  /* Override JsonEditor container styles to remove borders/radius if needed for seamless look */
  :global(.log-details .json-editor-container) {
    border: none !important;
    border-radius: 0 !important;
    background-color: transparent !important;
  }
  
  :global(.cm-editor) {
    font-size: 12px;
    background-color: transparent !important;
  }

  :global(.cm-gutters) {
    background-color: var(--pm-bg) !important; /* Match gutter to background */
    border-right: 1px solid var(--pm-border) !important;
  }
</style>
