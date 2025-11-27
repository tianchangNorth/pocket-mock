<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { keymap } from '@codemirror/view';
  import { defaultKeymap } from '@codemirror/commands';
  import { json } from '@codemirror/lang-json';
  import { oneDark } from '@codemirror/theme-one-dark';

  export let value: string = '';

  let editorContainer: HTMLDivElement;
  let editorView: EditorView;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        EditorView.lineWrapping,
        json(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            dispatch('change', update.state.doc.toString());
          }
        })
      ]
    });

    const root = editorContainer.getRootNode();

    editorView = new EditorView({
      state: startState,
      parent: editorContainer,
      root: root as Document | ShadowRoot
    });
  });

  onDestroy(() => {
    editorView?.destroy();
  });

  // Reactive update when prop 'value' changes externally
  $: if (editorView && value !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: value
      }
    });
  }
</script>

<div class="json-editor-container" bind:this={editorContainer}></div>

<style>
  .json-editor-container {
    height: 100%;
    min-height: 150px;
    width: 100%;
    overflow: auto; /* Ensures scrollability if content exceeds bounds */
    border: 1px solid var(--pm-border); /* Use existing border variable */
    border-radius: 4px; /* Apply to container */
  }

  /* Override CodeMirror's default background to match theme */
  :global(.cm-editor) {
    height: 100%;
    background-color: var(--pm-input-bg) !important; /* Use existing input background variable */
    border-radius: 4px; /* Ensure inner editor also respects border-radius visually */
    font-family: 'Menlo', 'Monaco', monospace !important; /* Match existing code editor font */
    font-size: 12px !important; /* Match existing code editor font size */
  }

  /* Adjust CodeMirror scroll bars if needed */
  :global(.cm-scroller) {
    overflow: auto;
  }
</style>