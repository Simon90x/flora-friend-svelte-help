<script>
  import { onMount } from 'svelte';
  import { user, page } from './lib/stores.js';
  import { supabase } from './lib/supabaseClient.js';

  // Importa le tue "pagine" dalla cartella /routes
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  
  // Queste pagine le creeremo nel prossimo step, per ora le commentiamo
  // import PlantDetail from './routes/PlantDetail.svelte';
  // import UserProfile from './routes/UserProfile.svelte';

  // Controlla lo stato di autenticazione all'avvio e ad ogni cambiamento.
  // Questa logica è corretta e la manteniamo.
  onMount(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      user.set(currentUser);

      // Se l'utente non è loggato, assicurati che sia sulla pagina di login.
      // Se è loggato, vai alla dashboard. Questo gestisce il reindirizzamento
      // dopo login, logout e al caricamento iniziale.
      if (currentUser) {
        // Se l'utente si logga, vogliamo portarlo alla dashboard.
        // Evitiamo di cambiare pagina se è già in una pagina interna come 'plantDetail'.
        if ($page === 'login' || $page === 'register') {
           $page = 'dashboard';
        }
      } else {
        // Se l'utente fa logout, lo riportiamo al login.
        $page = 'login';
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });
</script>

<main class="font-sans">
  {#if $user === undefined}
    <!-- 1. Stato di caricamento iniziale mentre Supabase controlla la sessione -->
    <div class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <p class="text-xl text-gray-500">Caricamento Flora Friend...</p>
    </div>

  {:else if !$user}
    <!-- 2. Se l'utente NON è loggato, mostriamo solo le pagine di autenticazione -->
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {#if $page === 'login'}
        <Login />
      {:else if $page === 'register'}
        <Register />
      {/if}
    </div>

  {:else}
    <!-- 3. Se l'utente È loggato, mostriamo il layout principale dell'app -->
    <div class="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <!-- Qui potremmo inserire una Sidebar in futuro -->
      <!-- <Sidebar /> -->

      <div class="flex-1 p-4 sm:p-6 lg:p-8">
        {#if $page === 'dashboard'}
          <Dashboard />
        {:else if $page === 'plantDetail'}
          <!-- <PlantDetail /> -->
          <p>Pagina Dettaglio Pianta (da implementare)</p>
        {:else if $page === 'profile'}
          <!-- <UserProfile /> -->
          <p>Pagina Profilo (da implementare)</p>
        {/if}
      </div>
    </div>
  {/if}
</main>