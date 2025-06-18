<script>
  import { onMount } from 'svelte';
  import  Router, {location,link } from 'svelte-spa-router';
  import { push } from 'svelte-spa-router';
  import { user, isSidebarOpen } from './lib/stores/index.js';
  import { supabase } from './lib/services/supabaseClient.js';
  import { routes } from './routes.js';

  import Sidebar from './lib/components/layout/Sidebar.svelte';

  let initialCheckDone = false;

  onMount(() => {
    // Controllo iniziale della sessione
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Non modificare l'utente se siamo in demo mode
      let isDemo = false;
      const unsubscribe = user.subscribe(u => { isDemo = u?.id === 'demo-user' });
      unsubscribe();
      if (!isDemo) {
        user.set(session?.user ?? null);
      }
      initialCheckDone = true;
    });

    // Listener per i cambi di stato autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      let isDemo = false;
      const unsubscribe = user.subscribe(u => { isDemo = u?.id === 'demo-user' });
      unsubscribe();
      
      const currentUser = session?.user ?? null;
      user.set(currentUser);

      if (!isDemo) {
        if (!currentUser && $location !== '/login' && $location !== '/register') {
          push('/login');
        } else if (currentUser && ($location === '/login' || $location === '/register')) {
          push('/dashboard');
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  });

  function closeSidebar() {
    isSidebarOpen.set(false);
  }

  // Determina se mostrare il layout completo dell'app
  $: showAppLayout = $user !== null;
</script>

<main class="font-sans antialiased text-gray-900 dark:text-gray-100">
  {#if !initialCheckDone}
    <div class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <p class="text-xl text-gray-500">Caricamento Flora Friend...</p>
    </div>
  {:else if !showAppLayout}
    <!-- Layout Autenticazione: le rotte pubbliche vengono renderizzate qui -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Router {routes} />
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
      <aside class="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </aside>

      <!-- Contenuto Principale -->
      <div class="flex-1 bg-gray-100 dark:bg-gray-800">
        <!-- Header Mobile -->
        <header class="lg:hidden sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm p-4 z-20 flex items-center">
            <button on:click={() => isSidebarOpen.set(true)} aria-label="Apri menu" class="text-gray-700 dark:text-gray-200">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span class="ml-4 font-bold text-lg text-green-600">FloraFriend</span>
        </header>

        <!-- Contenitore della Vista Attiva (gestito dal router) -->
        <div class="p-4 sm:p-6 lg:p-8">
          <Router {routes} />
        </div>
      </div>
    </div>
  {/if}
</main>