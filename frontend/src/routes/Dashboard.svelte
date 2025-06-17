<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  import { user, page, selectedPlant } from '../lib/stores.js'; // Importa anche selectedPlant

  import PlantCard from '../lib/components/PlantCard.svelte';
  import PlantCardSkeleton from '../lib/components/skeletons/PlantCardSkeleton.svelte';
  import EmptyState from '../lib/components/ui/EmptyState.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import PlusIcon from '../lib/components/ui/icons/PlusIcon.svelte';
  import LeafIcon from '../lib/components/ui/icons/LeafIcon.svelte';

  // Importa i nuovi componenti per la modale e il form
  import Modal from '../lib/components/modals/Modal.svelte';
  import AddPlantForm from '../lib/components/forms/AddPlantForm.svelte';

  let plants = [];
  let isLoading = true;
  let error = '';
  
  // Stato per la modale
  let isModalOpen = false;

  onMount(() => {
    // Se l'utente è in modalità demo, carica dati fittizi
    if ($user.id === 'demo-user') {
      loadDemoPlants();
    } else {
      fetchPlants();
    }
  });

  function loadDemoPlants() {
    isLoading = false;
    plants = [
      { id: 'demo1', name: 'Monstera Deliciosa', species: 'Araceae', cover_image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400', notes: 'Pianta demo molto bella.' },
      { id: 'demo2', name: 'Sansevieria', species: 'Trifasciata', cover_image_url: 'https://images.unsplash.com/photo-1592152737979-994629e4874b?w=400', notes: 'Pianta demo resistente.' },
    ];
  }

  async function fetchPlants() {
    isLoading = true;
    error = '';
    try {
      const { data, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', $user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      plants = data || [];
    } catch (e) {
      error = 'Impossibile caricare le piante: ' + e.message;
    } finally {
      isLoading = false;
    }
  }

  function handleAddPlant() {
    alert('Funzionalità "Aggiungi Pianta" da implementare! (Es. aprire una modale)');
  }

  // Funzione per navigare al dettaglio della pianta
  function handleNavigateToDetail(event) {
    const plant = event.detail.plant;
    selectedPlant.set(plant); // Salva la pianta selezionata nello store
    $page = 'plantDetail';      // Cambia pagina
  }

  async function handleLogout() {
    // Se è un utente demo, basta resettare lo store
    if ($user.id === 'demo-user') {
        user.set(null);
        $page = 'login';
    } else {
        await supabase.auth.signOut();
        // onAuthStateChange si occuperà del resto
    }
  }
</script>

<div class="max-w-7xl mx-auto">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Le Tue Piante</h1>
    <div class="flex items-center space-x-4">
      <Button on:click={() => isModalOpen = true} variant="primary">        <span slot="leftIcon"><PlusIcon /></span>
        Aggiungi Pianta
      </Button>
      <Button on:click={handleLogout} variant="secondary">Logout</Button>
    </div>
  </div>

<Modal isOpen={isModalOpen} onClose={() => isModalOpen = false} size="lg">
  <AddPlantForm
    on:close={() => isModalOpen = false}
    onSuccess={handleAddPlantSuccess}
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
      on:actionClick={handleAddPlant}
    >
      <LeafIcon slot="icon" class="w-24 h-24" />
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each plants as plant (plant.id)}
        <PlantCard {plant} on:navigateToDetail={handleNavigateToDetail} />
      {/each}
    </div>
  {/if}
</div>
