<script>
  import { createEventDispatcher } from 'svelte';
  import { api } from '../../services/api.js';
  import { toast } from '../../stores/notifications.js';
  // Importiamo la funzione aggiornata per Pl@ntNet
  import { suggestSpeciesFromImage } from '../../services/imageClassifier.js';

  import ImageInput from '../ui/ImageInput.svelte';
  import Button from '../ui/Button.svelte';
  import { fade } from 'svelte/transition';

  export let onSuccess = () => {};

  // Stato del form
  let plantName = '';
  let plantSpecies = '';
  let acquisitionDate = new Date().toISOString().split('T')[0];
  let notes = '';
  let coverImageBase64 = null;

  // Stato per l'API di identificazione
  // Questo ora conterrà i suggerimenti formattati da Pl@ntNet
  let suggestions = [];
  let isSuggesting = false;

  // Stato per il submit del form
  let isLoading = false;
  let error = '';

  const dispatch = createEventDispatcher();

  function handleImage(event) {
    coverImageBase64 = event.detail.base64;
    suggestions = []; // Resetta i suggerimenti quando l'immagine cambia
  }

  // --- Funzione MODIFICATA per Pl@ntNet ---
  async function handleSuggestSpecies() {
    if (!coverImageBase64) return;
    isSuggesting = true;
    error = '';
    suggestions = [];

    try {
      // Chiamiamo la funzione che ora contatta Pl@ntNet
      const result = await suggestSpeciesFromImage(coverImageBase64);

      // Gestiamo la struttura della risposta di Pl@ntNet
      if (result && result.results?.length > 0) {
        
        // Formattiamo i risultati in un array più semplice da usare nella UI
        suggestions = result.results.map(r => ({
          commonName: r.species.commonNames[0] || r.species.scientificNameWithoutAuthor,
          scientificName: r.species.scientificNameWithoutAuthor,
          score: r.score,
        }));

        // Pre-compiliamo i campi del form con il suggerimento migliore (il primo della lista)
        const topSuggestion = suggestions[0];
        plantName = topSuggestion.commonName;
        plantSpecies = topSuggestion.scientificName;
        
        toast.push(`Pianta identificata come "${topSuggestion.commonName}"!`, { type: 'success' });

      } else {
        toast.push('Nessuna pianta identificata in questa immagine.', { type: 'info' });
      }
    } catch (e) {
      error = e.message;
      toast.push(error, { type: 'error' });
    } finally {
      isSuggesting = false;
    }
  }

  // --- NUOVA Funzione per applicare un suggerimento dalla lista ---
  function applySuggestion(suggestionToApply) {
    plantName = suggestionToApply.commonName;
    plantSpecies = suggestionToApply.scientificName;
    toast.push(`Specie aggiornata a "${suggestionToApply.commonName}".`, { type: 'info' });
  }

  // La funzione per salvare la pianta rimane invariata
  async function handleSubmit() {
    if (!plantName.trim()) {
      error = 'Il nome della pianta è obbligatorio.';
      return;
    }
    isLoading = true;
    error = '';
    try {
      const plantData = {
        name: plantName,
        species: plantSpecies,
        date_added: acquisitionDate,
        notes: notes,
      };
      await api.addPlant(plantData, coverImageBase64);
      toast.push(`Pianta "${plantName}" aggiunta con successo!`, { type: 'success' });
      onSuccess();
      dispatch('close');
    } catch (e) {
      console.error('Errore nel salvataggio della pianta:', e);
      error = e.message || 'Si è verificato un errore imprevisto.';
      toast.push(error, { type: 'error' });
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
    Aggiungi una nuova pianta
  </h2>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    
    <!-- ImageInput non ha più bisogno di ricevere le predizioni,
         non disegneremo più i bounding box per questa versione con Pl@ntNet -->
    <ImageInput 
      label="Immagine di Copertina" 
      on:imageChange={handleImage} 
    />

    <!-- Mostra il pulsante "Identifica" solo se abbiamo un'immagine ma non ancora dei suggerimenti -->
    {#if coverImageBase64 && suggestions.length === 0}
      <div transition:fade={{ duration: 150 }}>
        <Button
          type="button"
          variant="secondary"
          on:click={handleSuggestSpecies}
          loading={isSuggesting}
        >
          {isSuggesting ? 'Analisi in corso...' : 'Identifica Specie'}
        </Button>
      </div>
    {/if}

    <!-- NUOVO BLOCCO: Mostra la lista dei suggerimenti dopo l'identificazione -->
    {#if suggestions.length > 0}
      <div class="mt-4 space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg" transition:fade>
        <h4 class="font-semibold text-gray-800 dark:text-gray-200">Suggerimenti dall'IA:</h4>
        <ul class="space-y-2">
          <!-- Mostriamo fino a 3 suggerimenti -->
          {#each suggestions.slice(0, 3) as s (s.scientificName)}
            <li>
              <button 
                type="button"
                on:click={() => applySuggestion(s)}
                class="w-full text-left p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <div class="flex justify-between items-center">
                  <span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{s.commonName}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 italic block">{s.scientificName}</span>
                  </span>
                  <span class="text-sm font-semibold text-green-600">
                    {(s.score * 100).toFixed(1)}%
                  </span>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    <div>
      <label for="plant-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Nome Pianta</label
      >
      <input
        type="text"
        id="plant-name"
        bind:value={plantName}
        required
        class="mt-1 w-full input"
        placeholder="Es. Monstera del salotto"
      />
    </div>

    <div>
      <label
        for="plant-species"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Specie (Nome Scientifico)</label
      >
      <input
        type="text"
        id="plant-species"
        bind:value={plantSpecies}
        class="mt-1 w-full input"
        placeholder="Es. Monstera deliciosa"
      />
    </div>

    <div>
      <label
        for="acquisition-date"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Data di Acquisizione</label
      >
      <input
        type="date"
        id="acquisition-date"
        bind:value={acquisitionDate}
        class="mt-1 w-full input"
      />
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Note</label
      >
      <textarea
        id="notes"
        bind:value={notes}
        rows="3"
        class="mt-1 w-full input"
        placeholder="Provenienza, cure particolari..."
      ></textarea>
    </div>

    {#if error && !isSuggesting}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <div class="flex justify-end space-x-3 pt-4">
      <Button
        type="button"
        variant="ghost"
        on:click={() => dispatch('close')}
        disabled={isLoading}
      >
        Annulla
      </Button>
      <Button type="submit" variant="primary" loading={isLoading}>
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