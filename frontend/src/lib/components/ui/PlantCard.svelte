<script>
  import { createEventDispatcher } from 'svelte';
  
  export let plant;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('navigateToDetail', { plant });
  }
</script>

{#if plant}
<button 
    on:click={handleClick}
    class="block w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 group
           hover:shadow-xl hover:shadow-green-500/20 dark:hover:shadow-green-400/10 hover:-translate-y-1"
    aria-label="Vedi dettagli per {plant.name}"
>
    <div class="relative overflow-hidden">
        <img 
            src={plant.cover_image_url || '...'} 
            alt="Immagine di {plant.name}" 
            class="h-48 w-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        >
        <!-- NUOVO: Overlay per informazioni aggiuntive (esempio) -->
        <div class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
            <span>{new Date(plant.date_added).toLocaleDateString('it-IT')}</span>
        </div>
    </div>
    <div class="p-5">
        <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">{plant.name}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{plant.species || 'Specie non specificata'}</p>
    </div>
</button>
{/if}