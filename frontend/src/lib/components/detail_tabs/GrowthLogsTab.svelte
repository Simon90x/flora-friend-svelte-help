<script>
  import EmptyState from '../ui/EmptyState.svelte';
  import Button from '../ui/Button.svelte';
  import PlusIcon from '../ui/icons/PlusIcon.svelte';
  import ConfirmationModal from '../modals/ConfirmationModal.svelte';
  import ImageViewerModal from '../modals/ImageViewerModal.svelte';
  import { mockApi } from '../../services/mockData.js';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition'; // 1. Importa fly
  import { flip } from 'svelte/animate'; // 2. Importa flip

  import PencilIcon from '../ui/icons/PencilIcon.svelte';
  import TrashIcon from '../ui/icons/TrashIcon.svelte';

  export let plantId;
  export let logs = [];
  export let onUpdate = () => {};

  const dispatch = createEventDispatcher();

  let logToDelete = null;
  let isConfirmDeleteOpen = false;
  let isLoadingDelete = false;

  // Stato per il visualizzatore immagini
  let isViewerOpen = false;
  let viewerStartIndex = 0;
  $: photoUrls = logs.map((log) => log.photo_url).filter(Boolean);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function handleDeleteClick(log) {
    logToDelete = log;
    isConfirmDeleteOpen = true;
  }

  async function confirmDelete() {
    if (!logToDelete) return;
    isLoadingDelete = true;
    await mockApi.deleteGrowthLog(plantId, logToDelete.id);
    isLoadingDelete = false;
    isConfirmDeleteOpen = false;
    logToDelete = null;
    onUpdate();
  }

  function openImageViewer(index) {
    viewerStartIndex = index;
    isViewerOpen = true;
  }
</script>

<div>
  <ImageViewerModal
    isOpen={isViewerOpen}
    images={photoUrls}
    startIndex={viewerStartIndex}
    onClose={() => (isViewerOpen = false)}
  />

  <ConfirmationModal
    isOpen={isConfirmDeleteOpen}
    title="Elimina Log"
    message="Sei sicuro di voler eliminare questo log di crescita? L'azione è irreversibile."
    onConfirm={confirmDelete}
    onCancel={() => (isConfirmDeleteOpen = false)}
    isLoading={isLoadingDelete}
  />

  <div class="flex justify-between items-center mb-6">
    <h3 class="text-xl font-semibold">Log di Crescita</h3>
    <Button variant="secondary" size="sm" on:click={() => dispatch('addLog')}>
      <PlusIcon slot="leftIcon" />
      Aggiungi Log
    </Button>
  </div>

  {#if logs.length === 0}
    <EmptyState
      title="Nessun log di crescita"
      message="Registra i progressi della tua pianta aggiungendo foto, note e misurazioni."
      actionText="Aggiungi il primo log"
      on:actionClick={() => dispatch('addLog')}
    />
  {:else}
    <div class="space-y-8">
      {#each logs as log, i (log.id)}
        <div in:fly={{ y: 20, duration: 300, delay: i * 50 }} animate:flip={{ duration: 300 }}>
          <div
            class="flex flex-col md:flex-row gap-6 p-4 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm"
          >
            <button on:click={() => openImageViewer(i)} class="flex-shrink-0 appearance-none">
              <img
                src={log.photo_url}
                alt="Log del {formatDate(log.date)}"
                class="w-full md:w-40 h-40 object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity cursor-pointer"
              />
            </button>

            <div class="flex-1 text-left">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-bold text-lg">{formatDate(log.date)}</p>
                  {#if log.height_cm}
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Altezza: {log.height_cm} cm
                    </p>
                  {/if}
                </div>
                <div class="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    on:click={() => alert('Modifica log non implementato')}
                  >
                    <PencilIcon slot="leftIcon" />
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                    on:click={() => handleDeleteClick(log)}
                  >
                    <TrashIcon slot="leftIcon" />
                    Elimina
                  </Button>
                </div>
              </div>
              <p class="mt-2 text-gray-700 dark:text-gray-300">
                {log.notes || 'Nessuna nota per questo log.'}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
