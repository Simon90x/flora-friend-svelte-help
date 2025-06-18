<script>
  import { createEventDispatcher } from 'svelte';
  import { mockApi } from '../../services/mockData.js';
  import ImageInput from '../ui/ImageInput.svelte';
  import Button from '../ui/Button.svelte';

  export let plantId;
  export let onSuccess = () => {};

  let logDate = new Date().toISOString().split('T')[0];
  let notes = '';
  let height = null;
  let photoBase64 = null;

  let isLoading = false;
  let error = '';

  const dispatch = createEventDispatcher();

  function handleImage(event) {
    photoBase64 = event.detail.base64;
  }

  async function handleSubmit() {
    if (!photoBase64) {
      error = 'La foto è obbligatoria per un log di crescita.';
      return;
    }

    isLoading = true;
    error = '';

    try {
      await mockApi.addGrowthLog(plantId, {
        date: logDate,
        notes: notes,
        height_cm: height,
        photo_url: photoBase64, // In demo, il base64 funge da URL
      });
      
      onSuccess();
      dispatch('close');

    } catch (e) {
      console.error('Errore nel salvataggio del log:', e);
      error = e.message || 'Si è verificato un errore imprevisto.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aggiungi Log di Crescita</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <ImageInput label="Foto del Log (obbligatoria)" on:imageChange={handleImage} />

    <div>
      <label for="log-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
      <input type="date" id="log-date" bind:value={logDate} class="mt-1 w-full input">
    </div>

    <div>
      <label for="log-height" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Altezza (cm, opzionale)</label>
      <input type="number" id="log-height" bind:value={height} class="mt-1 w-full input" placeholder="Es. 35">
    </div>

    <div>
      <label for="log-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
      <textarea id="log-notes" bind:value={notes} rows="3" class="mt-1 w-full input" placeholder="Nuove foglie, cambiamenti..."></textarea>
    </div>

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="ghost" on:click={() => dispatch('close')} disabled={isLoading}>
        Annulla
      </Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Salvataggio...' : 'Salva Log'}
      </Button>
    </div>
  </form>
</div>

<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>