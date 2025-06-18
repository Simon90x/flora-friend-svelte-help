<script>
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '../../services/supabaseClient.js';
  import { user } from '../../stores/index.js';
  import { mockApi } from '../../services/mockData.js';
  import ImageInput from '../ui/ImageInput.svelte';
  import Button from '../ui/Button.svelte';

  export let onSuccess = () => {};

  let plantName = '';
  let plantSpecies = '';
  let acquisitionDate = new Date().toISOString().split('T')[0];
  let notes = '';
  let coverImageBase64 = null;

  let isLoading = false;
  let error = '';

  const dispatch = createEventDispatcher();

  function handleImage(event) {
    coverImageBase64 = event.detail.base64;
  }

  async function handleSubmit() {
    if (!plantName.trim()) {
      error = 'Il nome della pianta è obbligatorio.';
      return;
    }

    isLoading = true;
    error = '';

    try {
      if ($user.id === 'demo-user') {
        // --- MOCK API CALL ---
        await mockApi.addPlant({
          name: plantName,
          species: plantSpecies,
          date_added: acquisitionDate,
          notes: notes,
          cover_image_url: coverImageBase64 || 'https://placehold.co/400x300/e2e8f0/4a5568?text=No+Image',
        });
      } else {
        // --- REAL API CALL ---
        let imageUrl = null;
        if (coverImageBase64) {
          const fileName = `public/${$user.id}/${Date.now()}.jpg`;
          const response = await fetch(coverImageBase64);
          const blob = await response.blob();
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('plant-images')
            .upload(fileName, blob);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage
            .from('plant-images')
            .getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }

        const { error: insertError } = await supabase.from('plants').insert({
          user_id: $user.id,
          name: plantName,
          species: plantSpecies,
          date_added: acquisitionDate,
          notes: notes,
          cover_image_url: imageUrl,
        });
        if (insertError) throw insertError;
      }

      onSuccess();
      dispatch('close');

    } catch (e) {
      console.error('Errore nel salvataggio della pianta:', e);
      error = e.message || 'Si è verificato un errore imprevisto.';
    } finally {
      isLoading = false;
    }
  }
</script>
<!-- ... (il resto del template rimane identico) ... -->
<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aggiungi una nuova pianta</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <ImageInput label="Immagine di Copertina" on:imageChange={handleImage} />

    <div>
      <label for="plant-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Pianta</label>
      <input type="text" id="plant-name" bind:value={plantName} required class="mt-1 w-full input" placeholder="Es. Monstera del salotto">
    </div>

    <div>
      <label for="plant-species" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Specie</label>
      <input type="text" id="plant-species" bind:value={plantSpecies} class="mt-1 w-full input" placeholder="Es. Monstera deliciosa">
    </div>

    <div>
      <label for="acquisition-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Data di Acquisizione</label>
      <input type="date" id="acquisition-date" bind:value={acquisitionDate} class="mt-1 w-full input">
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
      <textarea id="notes" bind:value={notes} rows="3" class="mt-1 w-full input" placeholder="Provenienza, cure particolari..."></textarea>
    </div>

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="ghost" on:click={() => dispatch('close')} disabled={isLoading}>
        Annulla
      </Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Salvataggio...' : 'Salva Pianta'}
      </Button>
    </div>
  </form>
</div>

<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>