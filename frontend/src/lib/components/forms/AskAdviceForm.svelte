<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { mockApi } from '../../services/mockData.js';
  import Button from '../ui/Button.svelte';
  import HorizontalScroller from '../ui/HorizontalScroller.svelte';

  export let plant;
  export let onSuccess = () => {};

  let question = '';
  let selectedImage = null; // Oggetto { url, index }
  
  let isLoading = false;
  let error = '';
  
  const dispatch = createEventDispatcher();
  
  // Estrai tutte le foto uniche dai log della pianta
  $: photoDiary = Array.from(new Set(plant.logs.map(log => log.photo_url).filter(Boolean)));

  function selectImage(url, index) {
      if (selectedImage?.url === url) {
          selectedImage = null; // Deseleziona se clicco la stessa immagine
      } else {
          selectedImage = { url, index };
      }
  }

  async function handleSubmit() {
    if (!question.trim()) {
      error = 'Per favore, inserisci una domanda.';
      return;
    }
    isLoading = true;
    error = '';
    try {
      await mockApi.addAiAdvice(plant.id, {
        question: question,
        image_url: selectedImage?.url || null,
      });
      onSuccess();
      dispatch('close');
    } catch (e) {
      error = 'Servizio AI non disponibile al momento.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Chiedi un consiglio all'IA</h2>
  <p class="text-gray-500 mb-4">per la tua pianta: <span class="font-semibold">{plant.name}</span></p>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
        <label for="ai-question" class="block text-sm font-medium text-gray-700 dark:text-gray-300">La tua domanda</label>
        <textarea id="ai-question" bind:value={question} required rows="4" class="mt-1 w-full input" placeholder="Es. Perché le foglie della mia pianta stanno diventando gialle?"></textarea>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allega una foto dal diario (opzionale)</label>
        {#if photoDiary.length > 0}
            <HorizontalScroller>
                {#each photoDiary as url, i (url)}
                    <button 
                        type="button" 
                        on:click={() => selectImage(url, i)}
                        class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-4 transition-colors {selectedImage?.index === i ? 'border-green-500' : 'border-transparent'}"
                    >
                        <img src={url} alt="Foto del diario {i+1}" class="w-full h-full object-cover">
                    </button>
                {/each}
            </HorizontalScroller>
        {:else}
            <p class="text-sm text-gray-500 italic">Nessuna foto disponibile nel diario di questa pianta.</p>
        {/if}
    </div>

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="ghost" on:click={() => dispatch('close')} disabled={isLoading}>Annulla</Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Invio in corso...' : 'Invia Domanda'}
      </Button>
    </div>
  </form>
</div>

<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>