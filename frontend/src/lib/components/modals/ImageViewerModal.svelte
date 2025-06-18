<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let isOpen = false;
  export let images = []; // Array di URL delle immagini
  export let startIndex = 0; // Indice dell'immagine da cui partire
  export let onClose = () => {};

  let currentIndex = startIndex;

  $: if (isOpen) {
    currentIndex = startIndex;
  }

  function showPrev() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
  }

  function showNext() {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if isOpen && images.length > 0}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    on:click|self={onClose}
    transition:fade={{ duration: 200 }}
  >
    <!-- Pulsante di chiusura -->
    <button
      on:click={onClose}
      class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
      aria-label="Chiudi visualizzatore"
    >
      <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>

    <!-- Pulsante Precedente -->
    {#if images.length > 1}
      <button
        on:click={showPrev}
        class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Immagine precedente"
      >
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
    {/if}

    <!-- Contenitore Immagine -->
    <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {#key currentIndex}
        <img
            src={images[currentIndex]}
            alt="Immagine ingrandita {currentIndex + 1} di {images.length}"
            class="max-w-full max-h-full object-contain shadow-2xl"
            in:fade={{ duration: 150 }}
        />
        {/key}
    </div>

    <!-- Pulsante Successivo -->
    {#if images.length > 1}
      <button
        on:click={showNext}
        class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Immagine successiva"
      >
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    {/if}

     <!-- Contatore -->
    {#if images.length > 1}
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
        </div>
    {/if}
  </div>
{/if}