<script>
  import EmptyState from '../ui/EmptyState.svelte';

  export let logs = [];

  $: photos = logs.map(log => log.photo_url).filter(Boolean);
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
      {#each photos as photoUrl, i (photoUrl + i)}
        <div class="aspect-w-1 aspect-h-1">
          <img 
            src={photoUrl} 
            alt="Foto del diario" 
            class="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
            loading="lazy"
          >
        </div>
      {/each}
    </div>
  {/if}
</div>