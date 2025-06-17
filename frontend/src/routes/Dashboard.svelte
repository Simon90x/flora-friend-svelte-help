<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/services/supabaseClient.js';
  import { user } from '../lib/stores/index.js';
  import { link } from 'svelte-spa-router'; // Usiamo 'link' per la navigazione programmatica

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

  onMount(fetchPlants);

  async function fetchPlants() {
    isLoading = true;
    error = '';
    // La modalità Demo ora viene gestita a livello di API mockata o con policy RLS specifiche
    if ($user.id === 'demo-user') {
      loadDemoPlants();
      return;
    }
    
    try {
      const { data, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      plants = data || [];
    } catch (e) {
      error = 'Impossibile caricare le piante: ' + e.message;
    } finally {
      isLoading = false;
    }
  }

  function loadDemoPlants() {
      isLoading = false;
      plants = [
        { id: 'demo1', name: 'Monstera Deliciosa', species: 'Araceae', cover_image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400', notes: 'Pianta demo molto bella.' },
        { id: 'demo2', name: 'Sansevieria', species: 'Trifasciata', cover_image_url: 'https://images.unsplash.com/photo-1592157379799-994629e4874b?w=400', notes: 'Pianta demo resistente.' },
      ];
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
      onSuccess={fetchPlants}
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
      <LeafIcon slot="icon" class="w-24 h-24" />
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each plants as plant (plant.id)}
        <a href="/plant/{plant.id}" use:link>
          <PlantCard {plant} />
        </a>
      {/each}
    </div>
  {/if}
</div>