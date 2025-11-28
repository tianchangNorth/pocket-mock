<script lang="ts">
  import { onDestroy, createEventDispatcher, tick } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';

  export let value: string = '';

  let editorContainer: HTMLDivElement;
  let editorView: EditorView | null = null;
  let initialized = false;

  const dispatch = createEventDispatcher();

  // Reactive initialization: wait for container to exist and be visible
  $: if (editorContainer && !initialized && !editorView) {
    tick().then(() => {
      initializeEditor();
    });
  }

  function initializeEditor() {
    if (!editorContainer || initialized || editorView) return;

    // Check if container has size - critical for CM in Shadow DOM
    if (editorContainer.offsetWidth === 0 && editorContainer.offsetHeight === 0) {
       return; // Wait for next tick/update
    }

    const root = editorContainer.getRootNode();

    try {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          oneDark,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update:any) => {
            if (update.docChanged) {
              dispatch('change', update.state.doc.toString());
            }
          })
        ]
      });

      editorView = new EditorView({
        state: startState,
        parent: editorContainer,
        root: root instanceof ShadowRoot ? root : undefined
      });

      initialized = true;

    } catch (e) {
      // console.error('[JsonEditor] Failed to initialize:', e); // Remove log
    }
  }

  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }
  });

  // Handle value changes
  $: if (initialized && editorView && value !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: value
      }
    });
  }
  
  // Watch for visibility changes (e.g. tab switch)
  $: if (!initialized && editorContainer && editorContainer.offsetHeight > 0) {
     initializeEditor();
  }
</script>

<div class="json-editor-container" bind:this={editorContainer}></div>

<style>
  .json-editor-container {
    width: 100%;
    height: 200px; /* Fixed height for better visual consistency */
    min-height: 200px;
    border: 1px solid var(--pm-border);
    border-radius: 4px;
    background-color: var(--pm-input-bg); /* Match container background with input field */
    overflow: hidden; /* Prevent double scrollbars, let CM handle it */
    position: relative;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* Focus state for container - more stable approach */
  .json-editor-container:focus-within {
    border-color: #666;
    outline: none;
    box-shadow: 0 0 0 1px #666;
  }

  /* Ensure CodeMirror fills the container completely */
  :global(.cm-editor) {
    height: 100% !important;
    width: 100% !important;
    background-color: var(--pm-input-bg) !important;
    border-radius: 4px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
  }

  /* Ensure the scroller fills the editor */
  :global(.cm-scroller) {
    height: 100% !important;
    overflow: auto !important;
    background-color: var(--pm-input-bg) !important;
  }

  /* Ensure content area matches background */
  :global(.cm-content) {
    background-color: var(--pm-input-bg) !important;
    padding: 12px !important;
    min-height: 100% !important;
    box-sizing: border-box !important;
  }

  /* Fix line background */
  :global(.cm-line) {
    background-color: transparent !important;
  }

  /* Remove CodeMirror's own focus indicators to prevent jumping */
  :global(.cm-editor.cm-focused) {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* Ensure no outline on content when focused */
  :global(.cm-content) {
    outline: none !important;
  }

  /* Improve scrollbars */
  :global(.cm-scroller::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  :global(.cm-scroller::-webkit-scrollbar-track) {
    background: var(--pm-input-bg) !important;
  }
  :global(.cm-scroller::-webkit-scrollbar-thumb) {
    background: var(--pm-text-secondary) !important;
    border-radius: 4px;
    border: none;
  }
  :global(.cm-scroller::-webkit-scrollbar-thumb:hover) {
    background: var(--pm-text-primary) !important;
  }
  :global(.cm-scroller::-webkit-scrollbar-corner) {
    background: var(--pm-input-bg) !important;
  }

  /* Debug info styling */
  :global(.debug-info ){
    padding: 12px;
    color: var(--pm-text-secondary);
    font-size: 12px;
    background-color: var(--pm-input-bg);
    border-radius: 4px;
  }
</style>