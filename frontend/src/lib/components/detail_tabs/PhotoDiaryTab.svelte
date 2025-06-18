<script>
  import EmptyState from '../ui/EmptyState.svelte';
  import { createEventDispatcher } from 'svelte';

  export let logs = [];
  
  const dispatch = createEventDispatcher();

  $: photos = logs.map(log => ({
    url: log.photo_url,
    date: new Date(log.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  })).filter(p => p.url);

  function openViewer(index) {
    // Comunica al genitore di aprire il visualizzatore
    dispatch('openImageViewer', {
      images: photos.map(p => p.url),
      startIndex: index
    });
  }
</script>

<div>
  <h3 class="text-xl font-semibold mb-6">Diario Fotografico</h3>

  {#if photos.length === 0}
    <EmptyState
      title="Nessuna foto trovata"
      message="Aggiungi dei log di crescita con foto per vederle apparire qui."
    />
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {#each photos as photo, i (photo.url + i)}
        <button on:click={() => openViewer(i)} class="aspect-w-1 aspect-h-1 block group relative">
          <img 
            src={photo.url} 
            alt="Foto del diario del {photo.date}" 
            class="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 rounded-lg">
            <p class="text-white text-xs font-semibold">{photo.date}</p>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>