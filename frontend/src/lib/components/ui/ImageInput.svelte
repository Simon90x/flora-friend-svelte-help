<script>
  import { createEventDispatcher } from 'svelte';
  import { resizeAndCompressImage } from '../../utils/imageUtils.js';

  export let label = 'Immagine';
  export let initialImage = null;

  let preview = initialImage;
  let isLoading = false;
  let isDragging = false;
  let error = '';
  let fileInput; // ref per l'input

  const dispatch = createEventDispatcher();

  // --- Gestione file via input ---
  async function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) await processFile(file);
  }

  // --- Gestione drag & drop ---
  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }
  function handleDragLeave() {
    isDragging = false;
  }
  async function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer.files[0];
    if (file) await processFile(file);
  }
  
  // FIX: Funzione per attivare il click sull'input
  function triggerFileInput() {
    fileInput.click();
  }

  // --- Logica di compressione/ridimensionamento ---
  async function processFile(file) {
    if (!file.type.startsWith('image/')) {
      error = 'Per favore, seleziona un file immagine.';
      return;
    }

    isLoading = true;
    error = '';
    try {
      const compressedBase64 = await resizeAndCompressImage(file);
      preview = compressedBase64;
      dispatch('imageChange', { base64: compressedBase64 });
    } catch (e) {
      console.error('Errore nel processare l’immagine:', e);
      error = 'C\'è stato un problema nel leggere l’immagine.';
    } finally {
      isLoading = false;
    }
  }

  // --- Rimuovi anteprima ---
  function removeImage() {
    preview = null;
    dispatch('imageChange', { base64: null });
    if(fileInput) fileInput.value = '';  // reset visivo
  }
</script>

<div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    {label}
  </label>

  {#if preview}
    <!-- Anteprima -->
    <div class="relative group mt-1">
      <img src={preview} alt="Anteprima" class="w-full h-48 object-cover rounded-lg shadow-inner" />
      <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <button
          type="button"
          on:click={removeImage}
          class="text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
          aria-label="Rimuovi immagine"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  {:else}
    <!-- Upload zone -->
    <div
      class="mt-1 relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
             {isDragging 
               ? 'border-green-500 bg-green-50 dark:bg-gray-700/50' 
               : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}"
      on:dragover|preventDefault={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop|preventDefault={handleDrop}
      on:click={triggerFileInput}
      role="button"
      tabindex="0"
      on:keydown={(e) => { if(e.key === 'Enter' || e.key === ' ') triggerFileInput() }}
    >
      <input
        bind:this={fileInput}
        type="file"
        class="sr-only"
        accept="image/*"
        disabled={isLoading}
        on:change={handleFileSelect}
        id="file-upload-input"
      />

      {#if isLoading}
        <!-- Spinner -->
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
                     c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="mt-2 text-sm">Elaborazione...</p>
        </div>
      {:else}
        <!-- Invito al caricamento -->
        <div class="flex flex-col items-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
               viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4
                     4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656
                     0L28 28M8 32l9.172-9.172a4 4 0 015.656
                     0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- FIX: La label ora punta all'ID corretto dell'input, ma il click è gestito dal contenitore. -->
          <label for="file-upload-input" class="relative cursor-pointer">
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium text-green-600 hover:text-green-500">Carica un file</span> o trascinalo qui
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, fino a 10MB</p>
          </label>
        </div>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-sm text-red-600 mt-1">{error}</p>
  {/if}
</div>