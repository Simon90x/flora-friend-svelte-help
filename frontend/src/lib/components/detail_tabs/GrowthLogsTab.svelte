<script>
  import EmptyState from '../ui/EmptyState.svelte';
  import Button from '../ui/Button.svelte';
  import PlusIcon from '../ui/icons/PlusIcon.svelte';

  export let logs = [];

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-xl font-semibold">Log di Crescita</h3>
    <Button variant="secondary" size="sm" on:click={() => alert('Apri modale Aggiungi Log!')}>
        <PlusIcon slot="leftIcon" />
        Aggiungi Log
    </Button>
  </div>

  {#if logs.length === 0}
    <EmptyState
      title="Nessun log di crescita"
      message="Registra i progressi della tua pianta aggiungendo foto, note e misurazioni."
      actionText="Aggiungi il primo log"
      on:actionClick={() => alert('Apri modale Aggiungi Log!')}
    />
  {:else}
    <div class="space-y-8">
      {#each logs as log (log.id)}
        <div class="flex flex-col md:flex-row gap-6">
          <img src={log.photo_url} alt="Log del {formatDate(log.date)}" class="w-full md:w-40 h-40 object-cover rounded-lg shadow-md">
          <div class="flex-1">
            <p class="font-bold text-lg">{formatDate(log.date)}</p>
            {#if log.height_cm}
              <p class="text-sm text-gray-500 dark:text-gray-400">Altezza: {log.height_cm} cm</p>
            {/if}
            <p class="mt-2 text-gray-700 dark:text-gray-300">{log.notes}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>