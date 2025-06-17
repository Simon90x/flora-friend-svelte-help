<script>
  import { onMount } from 'svelte';
  import { user, page } from './lib/stores.js'; // Usiamo uno store unificato
  import { supabase } from './lib/supabaseClient.js';

  // Importa i componenti che fungono da pagine
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Register from './routes/Register.svelte';
  // Aggiungi qui altre pagine come PlantDetail, Profile, etc.

  // Controlla lo stato di autenticazione all'avvio dell'app
  onMount(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      user.set(currentUser); // Aggiorna lo store globale
      
      if (currentUser) {
        $page = 'dashboard'; // Se l'utente è loggato, vai alla dashboard
      } else {
        $page = 'login'; // Altrimenti, vai al login
      }
    });

    // Pulisci il listener quando il componente viene distrutto
    return () => {
      authListener.subscription.unsubscribe();
    };
  });
</script>

<main class="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
  {#if $user === undefined}
    <!-- Stato iniziale di caricamento mentre si controlla l'utente -->
    <div class="flex items-center justify-center h-screen">
      <p>Caricamento...</p>
    </div>
  {:else if !$user}
    <!-- Se l'utente non è loggato, mostra solo Login o Register -->
    {#if $page === 'login'}
      <Login />
    {:else if $page === 'register'}
      <Register />
    {/if}
  {:else}
    <!-- Layout per utente loggato -->
    <div class="flex-1">
      {#if $page === 'dashboard'}
        <Dashboard />
      {:else if $page === 'profile'}
        <!-- <UserProfile /> -->
        <p>Pagina Profilo (da implementare)</p>
      {:else if $page === 'plantDetail'}
        <!-- <PlantDetail /> -->
        <p>Pagina Dettaglio Pianta (da implementare)</p>
      {/if}
    </div>
  {/if}
</main>