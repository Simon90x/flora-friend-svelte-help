<script>
  import { createEventDispatcher, onMount } from 'svelte';
  // RIMOSSO: `mockApi` non è più usato direttamente
  // import { mockApi } from '../../services/mockData.js';
  
  // AGGIUNTO: Le nostre nuove dipendenze
  import { api } from '../../services/api.js';
  import { toast } from '../../stores/notifications.js';

  // Importazioni componenti UI (invariate)
  import Button from '../ui/Button.svelte';
  import HorizontalScroller from '../ui/HorizontalScroller.svelte';

  export let plant;
  export let onSuccess = () => {};

  let question = '';
  let selectedImage = null; // Oggetto { url, index }
  
  let isLoading = false;
  let error = '';
  
  const dispatch = createEventDispatcher();
  
  // Questa logica rimane invariata, ma ora usa `plant.growth_logs`
  $: photoDiary = Array.from(new Set(plant.growth_logs.map(log => log.photo_url).filter(Boolean)));

  function selectImage(url, index) {
      if (selectedImage?.url === url) {
          selectedImage = null;
      } else {
          selectedImage = { url, index };
      }
  }

  // --- MODIFICA PRINCIPALE: handleSubmit ---
  async function handleSubmit() {
    if (!question.trim()) {
      error = 'Per favore, inserisci una domanda.';
      return;
    }
    isLoading = true;
    error = '';
    try {
      // 1. Prepariamo i dati per la nostra API
      const adviceData = {
        question: question,
        image_url: selectedImage?.url || null, // Passiamo l'URL dell'immagine selezionata
      };
      
      // 2. Chiamiamo la funzione centralizzata
      await api.addAiAdvice(plant.id, adviceData);
      
      // 3. Notifica di successo e chiusura
      toast.push('Domanda inviata! La risposta apparirà a breve.', { type: 'success' });
      onSuccess();
      dispatch('close');

    } catch (e) {
      console.error('Errore durante l\'invio della domanda:', e);
      error = e.message || 'Servizio AI non disponibile al momento.';
      toast.push(error, { type: 'error' });
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
      <!-- MODIFICATO: Aggiunta la prop `loading` per lo spinner -->
      <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading}>
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