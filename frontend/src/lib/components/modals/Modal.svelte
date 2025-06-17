<!--
  Componente Modale Generico e Accessibile
  - Props:
    - isOpen (boolean): Controlla la visibilità della modale.
    - onClose (function): Callback da eseguire alla chiusura.
    - size (string): 'sm', 'md', 'lg', 'xl' per la larghezza.
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  export let isOpen = false;
  export let onClose = () => {};
  export let size = 'md'; // default size

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  // Gestione chiusura con tasto Escape
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if isOpen}
  <!--
    Contenitore principale della modale con ARIA attributes per l'accessibilità.
    `role="dialog"` e `aria-modal="true"` comunicano agli screen reader
    che il contenuto sottostante è inerte.
  -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
  >
    <!-- Sfondo semi-trasparente (backdrop) -->
    <div
      class="fixed inset-0 bg-black/60"
      on:click={onClose}
      transition:fly={{ duration: 200, y: 10, opacity: 0 }}
    ></div>

    <!-- Contenuto effettivo della modale -->
    <div
      class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full {sizeClasses[size]}"
      transition:fly={{ duration: 300, y: 20, opacity: 0 }}
    >
      <!--
        Lo slot permette di inserire qualsiasi contenuto (es. il nostro form)
        dall'esterno, rendendo il componente Modal completamente generico.
      -->
      <slot></slot>
    </div>
  </div>
{/if}