<script>
  import EmptyState from '../ui/EmptyState.svelte';
  import Button from '../ui/Button.svelte';
  import PlusIcon from '../ui/icons/PlusIcon.svelte';
  import ConfirmationModal from '../modals/ConfirmationModal.svelte';
  import { mockApi } from '../../services/mockData.js';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let plantId;
  export let aiAdvices = [];
  export let onUpdate = () => {};

  const dispatch = createEventDispatcher();

  let adviceToDelete = null;
  let isConfirmDeleteOpen = false;
  let isLoadingDelete = false;
  
  // Stato per la visualizzazione espansa
  let expandedAdviceId = null;

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  async function confirmDelete() {
    if (!adviceToDelete) return;
    isLoadingDelete = true;
    await mockApi.deleteAiAdvice(plantId, adviceToDelete.id);
    isLoadingDelete = false;
    isConfirmDeleteOpen = false;
    adviceToDelete = null;
    onUpdate();
  }

  function toggleExpand(adviceId) {
    if (expandedAdviceId === adviceId) {
      expandedAdviceId = null;
    } else {
      expandedAdviceId = adviceId;
    }
  }
</script>

<div>
  <ConfirmationModal
    isOpen={isConfirmDeleteOpen}
    title="Elimina Consiglio"
    message="Sei sicuro di voler eliminare questa conversazione con l'IA?"
    onConfirm={confirmDelete}
    onCancel={() => isConfirmDeleteOpen = false}
    isLoading={isLoadingDelete}
  />
  
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-xl font-semibold">Consigli AI</h3>
    <Button variant="secondary" size="sm" on:click={() => dispatch('askAdvice')}>
      <PlusIcon slot="leftIcon" />
      Chiedi un consiglio
    </Button>
  </div>

  {#if aiAdvices.length === 0}
    <EmptyState
      title="Nessun consiglio richiesto"
      message="Hai un dubbio sulla cura della tua pianta? Chiedi un consiglio alla nostra IA."
      actionText="Fai la prima domanda"
      on:actionClick={() => dispatch('askAdvice')}
    />
  {:else}
    <div class="space-y-4">
      {#each aiAdvices as advice (advice.id)}
        <div class="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm overflow-hidden">
          <button on:click={() => toggleExpand(advice.id)} class="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center">
            <div>
              <p class="font-semibold truncate pr-4">{advice.question}</p>
              <p class="text-sm text-gray-500">{formatDate(advice.date)}</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform {expandedAdviceId === advice.id ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {#if expandedAdviceId === advice.id}
            <div class="p-4 border-t border-gray-200 dark:border-gray-700" transition:fly={{ y: -10, duration: 200 }}>
                {#if advice.image_url}
                    <img src={advice.image_url} alt="Immagine allegata alla domanda" class="rounded-lg max-h-48 mb-4">
                {/if}
                <div class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="whitespace-pre-wrap">{advice.answer}</p>
                </div>
                <div class="text-right mt-4">
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-100" on:click={() => { adviceToDelete = advice; isConfirmDeleteOpen = true; }}>
                        Elimina
                    </Button>
                </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>