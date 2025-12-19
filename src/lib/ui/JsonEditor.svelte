<script lang="ts">
  import { onDestroy, createEventDispatcher, tick } from 'svelte';
  import { EditorView, lineNumbers as cmLineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from '@codemirror/view';
  import { EditorState, Compartment } from '@codemirror/state';
  import { json } from '@codemirror/lang-json';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
  import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
  import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
  import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
  import { lintKeymap } from '@codemirror/lint';

  export let value: string = '';
  export let height: string = '200px';
  export let maxHeight: string = '';
  export let readonly: boolean = false;
  export let lineNumbers: boolean = true;
  export let lang: 'json' | 'javascript' = 'json';

  let editorContainer: HTMLDivElement;
  let editorView: EditorView | null = null;
  let initialized = false;
  const languageCompartment = new Compartment();

  const dispatch = createEventDispatcher();

  $: if (editorContainer && !initialized && !editorView) {
    tick().then(() => {
      initializeEditor();
    });
  }

  $: if (initialized && editorView) {
    const languageExtension = lang === 'javascript' ? javascript() : json();
    editorView.dispatch({
      effects: languageCompartment.reconfigure(languageExtension)
    });
  }

  function initializeEditor() {
    if (!editorContainer || initialized || editorView) return;

    if (editorContainer.offsetWidth === 0 && editorContainer.offsetHeight === 0) {
       return; 
    }

    const root = editorContainer.getRootNode();
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    try {
      const themeOptions: Record<string, string> = {
        fontSize: "13px"
      };
      
      if (height !== 'auto') {
        themeOptions.height = "100%";
      } else if (maxHeight) {
        themeOptions.maxHeight = maxHeight;
        themeOptions.overflow = "auto";
      }

      // Manual setup to allow toggling lineNumbers while keeping foldGutter
      const extensions = [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap
        ]),
        languageCompartment.of(lang === 'javascript' ? javascript() : json()),
        isDark ? oneDark : [],
        EditorView.lineWrapping,
        foldGutter(), // Always include foldGutter
        EditorView.theme({
          "&": themeOptions,
          ".cm-scroller": { overflow: "auto" },
          ".cm-gutters": { border: "none", backgroundColor: "transparent" }
        }),
        EditorView.updateListener.of((update:any) => {
          if (update.docChanged) {
            dispatch('change', update.state.doc.toString());
          }
        })
      ];

      if (lineNumbers) {
        extensions.push(cmLineNumbers());
        extensions.push(highlightActiveLineGutter());
      }

      if (readonly) {
        extensions.push(EditorState.readOnly.of(true));
      }

      const startState = EditorState.create({
        doc: value,
        extensions
      });

      editorView = new EditorView({
        state: startState,
        parent: editorContainer,
        root: root instanceof ShadowRoot ? root : undefined
      });

      initialized = true;

    } catch (e:any) {
      throw new Error(e?.message ?? 'has an unkonw error')
    }
  }

  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }
  });

  $: if (initialized && editorView && value !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: value
      }
    });
  }
  
  $: if (!initialized && editorContainer && editorContainer.offsetHeight > 0) {
     initializeEditor();
  }
</script>

<div 
  class="json-editor-container" 
  style="height: {height}; --max-height: {maxHeight || 'none'};" 
  bind:this={editorContainer}
></div>

<style>
  .json-editor-container {
    width: 100%;
    min-height: 50px;
    max-height: var(--max-height);
    border: 1px solid var(--pm-border);
    border-radius: 4px;
    background-color: var(--pm-input-bg);
    overflow: hidden;
    position: relative;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .json-editor-container:focus-within {
    border-color: var(--pm-primary, #666);
    outline: none;
    box-shadow: 0 0 0 1px var(--pm-primary, #666);
  }

  :global(.cm-scroller::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  :global(.cm-scroller::-webkit-scrollbar-track) {
    background: var(--pm-input-bg);
    border-radius: 4px;
  }
  :global(.cm-scroller::-webkit-scrollbar-thumb) {
    background: var(--pm-text-secondary);
    border-radius: 4px;
    border: none; 
  }
  :global(.cm-scroller::-webkit-scrollbar-thumb:hover) {
    background: var(--pm-text-primary);
  }
  :global(.cm-scroller::-webkit-scrollbar-corner) {
    background: transparent;
  }

  :global(.cm-foldGutter .cm-gutterElement) {
    padding: 0 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: color 0.2s;
  }

  :global(.cm-foldGutter .cm-gutterElement:hover) {
    color: var(--pm-text-primary) !important;
  }

  :global(.cm-foldGutter .cm-gutterElement svg) {
    width: 14px !important;
    height: 14px !important;
  }
</style>