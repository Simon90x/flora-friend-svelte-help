<script>
  import { createEventDispatcher } from 'svelte';
  
  export let plant;

  const dispatch = createEventDispatcher();

  function handleClick() {
    // Invia un evento al genitore (Dashboard) con i dati della pianta
    dispatch('navigateToDetail', { plant });
  }
</script>

{#if plant}
<button 
    on:click={handleClick}
    class="block w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    aria-label="Vedi dettagli per {plant.name}"
>
    <div class="relative">
        <img src={plant.cover_image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'} alt="Immagine di {plant.name}" class="h-48 w-full object-cover rounded-t-xl">
    </div>
    <div class="p-5">
        <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">{plant.name}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{plant.species || 'Specie non specificata'}</p>
    </div>
</button>
{/if}