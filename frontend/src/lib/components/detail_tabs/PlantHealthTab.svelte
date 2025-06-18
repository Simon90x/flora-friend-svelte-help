<script>
  import EmptyState from '../ui/EmptyState.svelte';
  import Button from '../ui/Button.svelte';
  import PlusIcon from '../ui/icons/PlusIcon.svelte';
  import ConfirmationModal from '../modals/ConfirmationModal.svelte';
  import { mockApi } from '../../services/mockData.js';
  import { createEventDispatcher } from 'svelte';
  
  export let plantId;
  export let healthLogs = [];
  export let onUpdate = () => {};

  const dispatch = createEventDispatcher();

  let logToDelete = null;
  let isConfirmDeleteOpen = false;
  let isLoadingDelete = false;
  
  const severityClasses = {
    Bassa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  async function confirmDelete() {
    if (!logToDelete) return;
    isLoadingDelete = true;
    await mockApi.deleteHealthLog(plantId, logToDelete.id);
    isLoadingDelete = false;
    isConfirmDeleteOpen = false;
    logToDelete = null;
    onUpdate();
  }
</script>

<div>
  <ConfirmationModal
    isOpen={isConfirmDeleteOpen}
    title="Elimina Nota Salute"
    message="Sei sicuro di voler eliminare questa nota?"
    onConfirm={confirmDelete}
    onCancel={() => isConfirmDeleteOpen = false}
    isLoading={isLoadingDelete}
  />
  
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-xl font-semibold">Salute della Pianta</h3>
    <Button variant="secondary" size="sm" on:click={() => dispatch('addHealthLog')}>
      <PlusIcon slot="leftIcon" />
      Aggiungi Nota
    </Button>
  </div>

  {#if healthLogs.length === 0}
    <EmptyState
      title="Nessuna nota sulla salute"
      message="Tieni traccia di parassiti, malattie o miglioramenti della tua pianta."
      actionText="Aggiungi la prima nota"
      on:actionClick={() => dispatch('addHealthLog')}
    />
  {:else}
    <div class="space-y-4">
      {#each healthLogs as log (log.id)}
        <div class="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="font-bold">{log.type}</p>
              <span class="text-sm text-gray-500">{formatDate(log.date)}</span>
              {#if log.severity}
                <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium {severityClasses[log.severity] || ''}">
                  {log.severity}
                </span>
              {/if}
            </div>
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-100 -mr-2 -mt-2" on:click={() => { logToDelete = log; isConfirmDeleteOpen = true; }}>
              Elimina
            </Button>
          </div>
          <p class="mt-2 text-gray-700 dark:text-gray-300">{log.notes}</p>
          {#if log.photo_url}
            <img src={log.photo_url} alt="Foto nota salute" class="mt-3 rounded-lg max-h-48 cursor-pointer" on:click={() => alert('Apri visualizzatore foto!')}>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>