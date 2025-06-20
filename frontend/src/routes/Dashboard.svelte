<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { api } from '../lib/services/api.js';
  import { toast } from '../lib/stores/notifications.js';
  import { user } from '../lib/stores/index.js'; // Aggiungi questa importazione se non c'è


  import PlantCard from '../lib/components/ui/PlantCard.svelte';
  import PlantCardSkeleton from '../lib/components/skeletons/PlantCardSkeleton.svelte';
  import EmptyState from '../lib/components/ui/EmptyState.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import PlusIcon from '../lib/components/ui/icons/PlusIcon.svelte';
  import LeafIcon from '../lib/components/ui/icons/LeafIcon.svelte';
  import Modal from '../lib/components/modals/Modal.svelte';
  import AddPlantForm from '../lib/components/forms/AddPlantForm.svelte';
  import { fly } from 'svelte/transition'; // 1. Importa la transizione
  import { flip } from 'svelte/animate'; // 2. Importa l'animazione

  let plants = [];
  let isLoading = true;
  let error = '';
  let isModalOpen = false;

  let currentUser;
  user.subscribe(u => currentUser = u);


  onMount(() => {
    loadPlants();
  });

  async function loadPlants() {
    isLoading = true;
    error = '';
    try {
   plants = await api.getPlants();
    } catch (e) {
      console.error('Errore nel caricamento delle piante:', e);
      error = 'Impossibile caricare le piante in questo momento.';
      toast.push(e.message || error, { type: 'error' });
    } finally {
      isLoading = false;
    }
  }

  function handleNavigateToDetail(event) {
    const plant = event.detail.plant;
    push(`/plant/${plant.id}`);
  }
</script>

<div class="max-w-7xl mx-auto">
    <div class="mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
      Bentornato, {currentUser?.user_metadata?.full_name || 'Giardiniere'}!
    </h1>
    <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">
      
    </p>
  </div>

  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Le Tue Piante</h1>
    <Button on:click={() => (isModalOpen = true)} variant="primary">
      <span slot="leftIcon"><PlusIcon /></span>
      Aggiungi Pianta
    </Button>
  </div>

  <Modal isOpen={isModalOpen} onClose={() => (isModalOpen = false)} size="lg">
    <AddPlantForm
      on:close={() => (isModalOpen = false)}
      onSuccess={() => {
        isModalOpen = false;
        loadPlants();
      }}
    />
  </Modal>

  {#if isLoading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each Array(4) as _}
        <PlantCardSkeleton />
      {/each}
    </div>
  {:else if error}
    <div class="text-center p-8 bg-red-100 text-red-700 rounded-lg">{error}</div>
  {:else if plants.length === 0}
    <EmptyState
      title="Nessuna pianta trovata"
      message="Inizia aggiungendo la tua prima pianta per monitorarla."
      actionText="Aggiungi la tua prima pianta"
      on:actionClick={() => (isModalOpen = true)}
    >
      <svelte:fragment slot="icon">
        <LeafIcon class="w-24 h-24" />
      </svelte:fragment>
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each plants as plant, i (plant.id)}
        <div in:fly={{ y: 20, duration: 250, delay: i * 50 }} animate:flip={{ duration: 300 }}>
          <PlantCard {plant} on:navigateToDetail={handleNavigateToDetail} />
        </div>
      {/each}
    </div>
  {/if}
</div>
