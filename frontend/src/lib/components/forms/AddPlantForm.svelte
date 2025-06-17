<!--
  Form per aggiungere o modificare una pianta.
  - Props:
    - onSuccess (function): Callback da eseguire dopo un salvataggio riuscito.
  - Events:
    - on:close: Richiede al componente genitore di chiudere la modale.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '../../services/supabaseClient.js';
  import { user } from '../../stores/index.js';
  import ImageInput from '../ui/ImageInput.svelte';
  import Button from '../ui/Button.svelte';

  export let onSuccess = () => {};

  let plantName = '';
  let plantSpecies = '';
  let acquisitionDate = new Date().toISOString().split('T')[0]; // Oggi come default
  let notes = '';
  let coverImageBase64 = null; // Qui salviamo l'immagine processata

  let isLoading = false;
  let error = '';

  const dispatch = createEventDispatcher();

  function handleImage(event) {
    coverImageBase64 = event.detail.base64;
  }

  async function handleSubmit() {
    // Validazione base
    if (!plantName.trim() || !plantSpecies.trim()) {
      error = 'Nome e specie della pianta sono campi obbligatori.';
      return;
    }

    isLoading = true;
    error = '';

    try {
      let imageUrl = null;
      // 1. Se c'è un'immagine, la carichiamo su Supabase Storage
      if (coverImageBase64) {
        // Il nome del file nello storage sarà univoco
        const fileName = `public/${$user.id}/${Date.now()}.jpg`;
        
        // Supabase storage si aspetta un File o Blob, non base64. Dobbiamo convertirlo.
        const response = await fetch(coverImageBase64);
        const blob = await response.blob();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('plant-images') // Assicurati che questo bucket esista nel tuo Supabase!
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        // 2. Otteniamo l'URL pubblico dell'immagine caricata
        const { data: urlData } = supabase.storage
          .from('plant-images')
          .getPublicUrl(uploadData.path);
        
        imageUrl = urlData.publicUrl;
      }

      // 3. Inseriamo i dati della pianta nel database
      const { error: insertError } = await supabase
        .from('plants') // Assicurati che questa tabella esista!
        .insert({
          user_id: $user.id,
          name: plantName,
          species: plantSpecies,
          date_added: acquisitionDate,
          notes: notes,
          cover_image_url: imageUrl,
        });

      if (insertError) throw insertError;

      // Successo!
      onSuccess(); // Esegui la callback (es. ricaricare le piante nel dashboard)
      dispatch('close'); // Chiudi la modale

    } catch (e) {
      console.error('Errore nel salvataggio della pianta:', e);
      error = e.message || 'Si è verificato un errore imprevisto durante il salvataggio.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aggiungi una nuova pianta</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <!-- Componente Input Immagine -->
    <ImageInput label="Immagine di Copertina" on:imageChange={handleImage} />

    <!-- Campi di testo -->
    <div>
      <label for="plant-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Pianta</label>
      <input type="text" id="plant-name" bind:value={plantName} required class="mt-1 w-full input" placeholder="Es. Monstera del salotto">
    </div>

    <div>
      <label for="plant-species" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Specie</label>
      <input type="text" id="plant-species" bind:value={plantSpecies} required class="mt-1 w-full input" placeholder="Es. Monstera deliciosa">
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

    <!-- Azioni del Form -->
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

<!-- Aggiungiamo uno stile generico per gli input -->
<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>