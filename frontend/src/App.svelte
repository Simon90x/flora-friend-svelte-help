<script>
  import { onMount } from 'svelte';
  import { user } from './lib/stores.js';
  import { page, selectedPlant } from './lib/navigation.js';
  import { supabase } from './lib/supabaseClient.js';
  
  // Importa le "pagine"
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import PlantDetail from './routes/PlantDetail.svelte'; // Assumendo che tu abbia questo file
  import Register from './routes/Register.svelte';

  let currentUser = null;
  let plants = [];
  let isLoading = true;
  let error = '';

  // Sottoscrivi allo store 'user' per reagire ai cambiamenti di login/logout
  user.subscribe(value => {
    currentUser = value;
    if (currentUser) {
      $page = 'dashboard'; // Se l'utente è loggato, vai alla dashboard
      fetchPlants();
    } else {
      $page = 'login'; // Altrimenti, vai al login
    }
  });

  // Funzione per caricare le piante dell'utente
  async function fetchPlants() {
    if (!currentUser) return;
    isLoading = true;
    error = '';
    try {
      const { data, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      plants = data || [];
    } catch (e) {
      error = "Impossibile caricare le piante: " + e.message;
    } finally {
      isLoading = false;
    }
  }

  // Gestori di eventi per la navigazione
  function handleNavigateToDetail(event) {
    const plantId = event.detail;
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      $selectedPlant = plant;
      $page = 'plantDetail';
    }
  }

  function handleAddPlant() {
    // Qui dovresti aprire un modale o una nuova pagina per aggiungere una pianta
    console.log('Azione: Aggiungi nuova pianta');
    alert('Funzionalità "Aggiungi Pianta" da implementare!');
  }

  // Gestisce il logout
  async function handleLogout() {
    await supabase.auth.signOut();
    user.set(null); // Questo triggererà la sottoscrizione e manderà alla pagina di login
    plants = [];
    $page = 'login';
  }
</script>

<main class="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
  {#if !currentUser}
    <!-- Se l'utente non è loggato, mostra solo Login o Register -->
    {#if $page === 'login'}
      <Login />
    {:else if $page === 'register'}
      <Register />
    {/if}
  {:else}
    <!-- Layout per utente loggato (es. con Sidebar) -->
    <div class="flex">
      <!-- <Sidebar on:logout={handleLogout} /> -->
      
      <div class="flex-1">
        {#if $page === 'dashboard'}
          <Dashboard 
            {plants} 
            {isLoading}
            on:addPlant={handleAddPlant}
            on:navigateToDetail={handleNavigateToDetail}
          />
        {:else if $page === 'plantDetail'}
          <PlantDetail />
        {:else if $page === 'profile'}
          <!-- <UserProfile /> -->
        {/if}
      </div>
    </div>
  {/if}
</main>