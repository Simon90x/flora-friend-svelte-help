<script>
  import { onMount } from 'svelte';
  import { user } from '../lib/stores/index.js';
  import { supabase } from '../lib/services/supabaseClient.js';
  import { mockApi } from '../lib/services/mockData.js';
  import { push } from 'svelte-spa-router';

  import PlantCard from '../lib/components/ui/PlantCard.svelte';
  import PlantCardSkeleton from '../lib/components/skeletons/PlantCardSkeleton.svelte';
  import EmptyState from '../lib/components/ui/EmptyState.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import PlusIcon from '../lib/components/ui/icons/PlusIcon.svelte';
  import LeafIcon from '../lib/components/ui/icons/LeafIcon.svelte';
  import Modal from '../lib/components/modals/Modal.svelte';
  import AddPlantForm from '../lib/components/forms/AddPlantForm.svelte';

  let plants = [];
  let isLoading = true;
  let error = '';
  let isModalOpen = false;

  onMount(() => {
    loadPlants();
  });

  async function loadPlants() {
    isLoading = true;
    error = '';
    try {
      let data;
      if ($user.id === 'demo-user') {
        data = await mockApi.getPlants();
      } else {
        const { data: realData, error: fetchError } = await supabase
          .from('plants')
          .select('*')
          .eq('user_id', $user.id)
          .order('created_at', { ascending: false });
        if (fetchError) throw fetchError;
        data = realData;
      }
      plants = data || [];
    } catch (e) {
      error = 'Impossibile caricare le piante: ' + e.message;
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
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Le Tue Piante</h1>
    <Button on:click={() => isModalOpen = true} variant="primary">
      <span slot="leftIcon"><PlusIcon /></span>
      Aggiungi Pianta
    </Button>
  </div>

  <Modal isOpen={isModalOpen} onClose={() => isModalOpen = false} size="lg">
    <AddPlantForm
      on:close={() => isModalOpen = false}
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
      on:actionClick={() => isModalOpen = true}
    >
      <svelte:fragment slot="icon">
        <LeafIcon class="w-24 h-24" />
      </svelte:fragment>
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each plants as plant (plant.id)}
        <PlantCard {plant} on:navigateToDetail={handleNavigateToDetail} />
      {/each}
    </div>
  {/if}
</div>