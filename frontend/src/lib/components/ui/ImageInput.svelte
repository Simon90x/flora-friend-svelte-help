<script>
  import { createEventDispatcher } from 'svelte';
  import { resizeAndCompressImage } from '../../utils/imageUtils.js';

  export let label = 'Immagine';
  export let initialImage = null;

  export let predictions = [];

  // NUOVO: Riferimenti agli elementi per il disegno
  let imageElement;
  let canvasElement;

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
  /*
  // FIX: Funzione per attivare il click sull'input
  function triggerFileInput() {
    fileInput.click();
  }
*/
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
      error = "C'è stato un problema nel leggere l’immagine.";
    } finally {
      isLoading = false;
    }
  }

  // --- Rimuovi anteprima ---
  function removeImage() {
    preview = null;
    predictions = []; // Pulisce anche i box disegnati

    dispatch('imageChange', { base64: null });
    if (fileInput) fileInput.value = ''; // reset visivo
  }

  // NUOVO: Funzione che disegna i box e le etichette
  function drawPredictions() {
    if (!canvasElement || !imageElement || predictions.length === 0) return;

    const ctx = canvasElement.getContext('2d');
    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;
    const displayWidth = imageElement.clientWidth;
    const displayHeight = imageElement.clientHeight;

    // Adatta le dimensioni del canvas a quelle dell'immagine visualizzata
    canvasElement.width = displayWidth;
    canvasElement.height = displayHeight;

    // Pulisce il canvas precedente
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const scaleX = displayWidth / naturalWidth;
    const scaleY = displayHeight / naturalHeight;

    predictions.forEach((p) => {
      if (!p.image_regions || p.image_regions.length === 0) return;

      const region = p.image_regions[0]; // Prendiamo la prima regione
      const box = {
        x: region.bounding_box.left * naturalWidth * scaleX,
        y: region.bounding_box.top * naturalHeight * scaleY,
        width: (region.bounding_box.right - region.bounding_box.left) * naturalWidth * scaleX,
        height: (region.bounding_box.bottom - region.bounding_box.top) * naturalHeight * scaleY,
      };

      // Disegna il rettangolo
      ctx.strokeStyle = '#34D399'; // Verde smeraldo
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Disegna l'etichetta con sfondo
      const commonName = p.plant_details.common_names?.[0] || p.plant_name;
      const confidence = (p.probability * 100).toFixed(1) + '%';
      const labelText = `${commonName} (${confidence})`;

      ctx.font = '14px sans-serif';
      const textWidth = ctx.measureText(labelText).width;

      ctx.fillStyle = '#34D399';
      ctx.fillRect(box.x - 1, box.y, textWidth + 10, 22);

      ctx.fillStyle = 'white';
      ctx.fillText(labelText, box.x + 4, box.y + 16);
    });
  }

  // Reattiva: ridisegna ogni volta che le predizioni cambiano
  $: if (preview && predictions) {
    // Aspetta un tick per assicurarsi che l'DOM sia aggiornato
    setTimeout(drawPredictions, 50);
  }
</script>

<div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    {label}
  </label>

  {#if preview}
    <!-- Anteprima -->

    <div class="relative group mt-1 h-72 w-full">
      <img
        bind:this={imageElement}
        src={preview}
        alt="Anteprima"
        class="w-full h-full object-contain rounded-lg shadow-inner bg-gray-100 dark:bg-gray-800"
        on:load={drawPredictions}
      />
      <canvas bind:this={canvasElement} class="absolute top-0 left-0 pointer-events-none"></canvas>

      <button
        type="button"
        on:click={removeImage}
        class="text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
        aria-label="Rimuovi immagine"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
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
      role="button"
      tabindex="0"
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
          <svg
            class="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
                     c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p class="mt-2 text-sm">Elaborazione...</p>
        </div>
      {:else}
        <!-- Invito al caricamento -->

        <label for="file-upload-input" class="flex flex-col items-center cursor-pointer">
          <!-- SVG icon -->
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-green-600 hover:text-green-500">Carica un file</span> o trascinalo
            qui
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, fino a 10MB</p>
        </label>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-sm text-red-600 mt-1">{error}</p>
  {/if}
</div>
