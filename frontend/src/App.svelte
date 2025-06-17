<script>
  import { onMount } from 'svelte';
  import { user, isSidebarOpen } from './lib/stores/index.js';
  import { supabase } from './lib/services/supabaseClient.js';
  import Router, { push, location } from 'svelte-spa-router';
  import { routes } from './routes.js';

  import Sidebar from './lib/components/layout/Sidebar.svelte';

  let currentRoute;

  // Lista delle route che non richiedono autenticazione
  const publicRoutes = ['/', '/login', '/register'];

  onMount(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      user.set(currentUser);

      const isPublicRoute = publicRoutes.includes(location.pathname);
      
      if (!currentUser && !isPublicRoute) {
        // Se l'utente non è loggato e si trova in una rotta protetta, reindirizza al login
        push('/login');
      } else if (currentUser && isPublicRoute) {
        // Se l'utente è loggato e si trova in una rotta pubblica, reindirizza alla dashboard
        push('/dashboard');
      }
    });

    return () => authListener.subscription.unsubscribe();
  });

  function closeSidebar() {
    isSidebarOpen.set(false);
  }

  // Wrapper per il router per gestire le route protette
  function routeGuard(detail) {
    const { route } = detail;
    const isPublic = publicRoutes.some(r => route.startsWith(r));

    if (!$user && !isPublic) {
      // Blocco navigazione verso route protette se non loggato
      return false;
    }
    currentRoute = route;
    return true; // Permetti la navigazione
  }
</script>

<main class="font-sans antialiased">
  {#if $user === undefined}
    <div class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <p class="text-xl text-gray-500">Caricamento Flora Friend...</p>
    </div>
  {:else if !$user}
    <!-- Layout Autenticazione: router per pagine pubbliche -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Router {routes} on:routeLoaded={routeGuard} />
    </div>
  {:else}
    <!-- Layout Applicazione Principale -->
    <div class="relative min-h-screen lg:flex">
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

      <div class="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div class="flex-1 bg-gray-100 dark:bg-gray-900">
        <header class="lg:hidden sticky top-0 bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-sm p-4 z-20 flex items-center">
            <button on:click={() => isSidebarOpen.set(true)} aria-label="Apri menu" class="text-gray-600 dark:text-gray-300">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span class="ml-4 font-bold text-lg text-green-600">FloraFriend</span>
        </header>

        <div class="p-4 sm:p-6 lg:p-8">
          <Router {routes} on:routeLoaded={routeGuard} />
        </div>
      </div>
    </div>
  {/if}
</main>