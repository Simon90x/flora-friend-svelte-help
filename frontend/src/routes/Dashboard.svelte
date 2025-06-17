<!-- src/routes/Dashboard.svelte -->
<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabaseClient.js';
  import { user, page } from '../lib/stores.js';

  // Importa i componenti che ti ho fornito
  import PlantCard from '../components/PlantCard.svelte';
  import PlantCardSkeleton from '../components/skeletons/PlantCardSkeleton.svelte';
  import EmptyState from '../components/ui/EmptyState.svelte';
  import Button from '../components/ui/Button.svelte';
  import { PlusIcon, LeafIcon } from '../components/ui/IconComponents.svelte';

  let plants = [];
  let isLoading = true;
  let error = '';

  onMount(() => {
    fetchPlants();
  });

  async function fetchPlants() {
    isLoading = true;
    error = '';
    try {
      const { data, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', $user.id) // Usa l'ID dell'utente dallo store
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      plants = data || [];
    } catch (e) {
      error = "Impossibile caricare le piante: " + e.message;
    } finally {
      isLoading = false;
    }
  }

  function handleAddPlant() {
    alert('Funzionalità "Aggiungi Pianta" da implementare!');
  }

  function handleNavigateToDetail(event) {
    // Logica per andare alla pagina di dettaglio
    console.log('Naviga al dettaglio della pianta:', event.detail);
    // selectedPlant.set(...)
    // page.set('plantDetail')
  }
  
  async function handleLogout() {
    await supabase.auth.signOut();
  }
</script>

<div class="p-4 md:p-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-green-600">
      Le Tue Piante
    </h1>
    <div>
      <Button on:click={handleAddPlant} variant="primary" size="md" className="mr-4">
        <PlusIcon slot="leftIcon" />
        Aggiungi Pianta
      </Button>
      <Button on:click={handleLogout} variant="secondary" size="md">
        Logout
      </Button>
    </div>
  </div>

  {#if isLoading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each Array(4) as _}
        <PlantCardSkeleton />
      {/each}
    </div>
  {:else if plants.length === 0}
    <EmptyState
      title="Nessuna pianta trovata"
      message="Inizia aggiungendo la tua prima pianta per monitorarla."
      actionText="Aggiungi la tua prima pianta"
      on:actionClick={handleAddPlant}
    >
      <LeafIcon slot="icon" className="w-24 h-24" />
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each plants as plant, index (plant.id)}
        <PlantCard 
          {plant} 
          {index}
          on:navigateToDetail={handleNavigateToDetail}
        />
      {/each}
    </div>
  {/if}
</div>