<script>
  import { createEventDispatcher } from 'svelte';
  // RIMOSSO: `mockApi`
  // import { mockApi } from '../../services/mockData.js';
  
  // AGGIUNTO: Le nostre nuove dipendenze
  import { api } from '../../services/api.js';
  import { toast } from '../../stores/notifications.js';

  // Importazioni componenti UI (invariate)
  import ImageInput from '../ui/ImageInput.svelte';
  import Button from '../ui/Button.svelte';

  export let plantId;
  export let onSuccess = () => {};

  // Stato del form (invariato)
  let logDate = new Date().toISOString().split('T')[0];
  let type = 'Miglioramento';
  let severity = '';
  let notes = '';
  let photoBase64 = null;

  let isLoading = false;
  let error = '';

  const dispatch = createEventDispatcher();
  const observationTypes = [
    'Peste',
    'Malattia',
    'Carenza Nutrienti',
    'Irrigazione/Luce',
    'Miglioramento',
    'Altro',
  ];
  const severities = ['Bassa', 'Media', 'Alta'];

  function handleImage(event) {
    photoBase64 = event.detail.base64;
  }

  // --- MODIFICA PRINCIPALE: handleSubmit ---
  async function handleSubmit() {
    if (!notes.trim() || !type) {
      error = 'Il tipo di osservazione e le note sono obbligatori.';
      return;
    }

    isLoading = true;
    error = '';

    try {
      // 1. Prepariamo l'oggetto con i dati della nota
      const logData = {
        date: logDate,
        type: type,
        severity: severity || null, // Invia null se la stringa è vuota
        notes: notes,
      };

      // 2. Chiamiamo la nostra API centralizzata.
      //    `photoBase64` può essere null, e `api.addHealthLog` lo gestirà.
      await api.addHealthLog(plantId, logData, photoBase64);

      // 3. Notifica di successo e chiusura
      toast.push('Nota sulla salute aggiunta!', { type: 'success' });
      onSuccess();
      dispatch('close');

    } catch (e) {
      console.error('Errore nel salvataggio della nota:', e);
      error = e.message || 'Si è verificato un errore nel salvataggio.';
      toast.push(error, { type: 'error' });
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
    Aggiungi Nota sulla Salute
  </h2>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="health-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Data</label
        >
        <input type="date" id="health-date" bind:value={logDate} class="mt-1 w-full input" />
      </div>
      <div>
        <div class="select-wrapper">
          <label
            for="health-type"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Tipo Osservazione</label
          >
          <select id="health-type" bind:value={type} class="mt-1 w-full input">
            {#each observationTypes as obsType}
              <option value={obsType}>{obsType}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div>
      <div class="select-wrapper">
        <label
          for="health-severity"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Gravità (opzionale)</label
        >
        <select id="health-severity" bind:value={severity} class="mt-1 w-full input">
          <option value="">Nessuna</option>
          {#each severities as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>
    </div>

    <div>
      <label for="health-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Note</label
      >
      <textarea
        id="health-notes"
        bind:value={notes}
        required
        rows="4"
        class="mt-1 w-full input"
        placeholder="Descrivi cosa hai osservato..."
      ></textarea>
    </div>

    <ImageInput label="Allega una foto (opzionale)" on:imageChange={handleImage} />

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="ghost" on:click={() => dispatch('close')} disabled={isLoading}
        >Annulla</Button
      >
      <!-- MODIFICATO: Passiamo `loading` al Button per lo spinner -->
      <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading}>
        {isLoading ? 'Salvataggio...' : 'Salva Nota'}
      </Button>
    </div>
  </form>
</div>

<!-- Lo stile rimane invariato -->
<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none;
  }
  .select-wrapper {
    @apply relative;
  }
  .select-wrapper::after {
    content: '▼';
    @apply text-gray-400 text-xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none;
  }
</style>