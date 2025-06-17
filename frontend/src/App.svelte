<script>
  import { onMount } from 'svelte';
  import { user, page, isSidebarOpen } from './lib/stores/index.js';
  import { supabase } from './lib/services/supabaseClient.js';

  // Importa le viste
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import PlantDetail from './routes/PlantDetail.svelte';
  //import UserProfile from './routes/UserProfile.svelte';

  // Importa il layout
  import Sidebar from './lib/components/layout/Sidebar.svelte';

  onMount(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      user.set(session?.user ?? null);
      if (!session?.user) {
        page.set('login');
      } else if ($page === 'login' || $page === 'register') {
        page.set('dashboard');
      }
    });
    return () => authListener.subscription.unsubscribe();
  });

  // Funzione per chiudere la sidebar mobile
  function closeSidebar() {
    isSidebarOpen.set(false);
  }
</script>

<main class="font-sans antialiased">
  {#if $user === undefined}
    <div class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <p class="text-xl text-gray-500">Caricamento Flora Friend...</p>
    </div>

  {:else if !$user}
    <!-- Layout Autenticazione: centrato -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      {#if $page === 'login'}
        <Login />
      {:else if $page === 'register'}
        <Register />
      {/if}
    </div>

  {:else}
    <!-- Layout Applicazione Principale -->
    <div class="relative min-h-screen lg:flex">
      
      <!-- Sidebar Mobile (a comparsa) -->
      {#if $isSidebarOpen}
        <div 
          class="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          on:click={closeSidebar}
          role="button"
          tabindex="-1"
          aria-label="Chiudi menu"
        ></div>
        <div class="fixed top-0 left-0 h-full z-40 lg:hidden">
            <Sidebar />
        </div>
      {/if}

      <!-- Sidebar Desktop (fissa) -->
      <div class="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </div>

      <!-- Contenuto Principale -->
      <div class="flex-1 bg-gray-100 dark:bg-gray-900">
        <!-- Header Mobile -->
        <header class="lg:hidden sticky top-0 bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-sm p-4 z-20 flex items-center">
            <button on:click={() => isSidebarOpen.set(true)} aria-label="Apri menu">
                <!-- Icona Hamburger -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span class="ml-4 font-bold text-lg text-green-600">FloraFriend</span>
        </header>

        <!-- Contenitore della Vista Attiva -->
        <div class="p-4 sm:p-6 lg:p-8">
          {#if $page === 'dashboard'}
            <Dashboard />
          {:else if $page === 'plantDetail'}
            <PlantDetail />
          {:else if $page === 'profile'}
            <Login />
          {/if}
        </div>
      </div>
    </div>
  {/if}
</main>