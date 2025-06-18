<script>
  import { user, isSidebarOpen } from '../../stores/index.js';
  import { supabase } from '../../services/supabaseClient.js';
  import { link, location } from 'svelte-spa-router';
  import { push } from 'svelte-spa-router';
  import { slide } from 'svelte/transition';

  // Importa le icone che useremo
  import LeafIcon from '../ui/icons/LeafIcon.svelte';
  import HomeIcon from '../ui/icons/HomeIcon.svelte';
  import UserCircleIcon from '../ui/icons/UserCircleIcon.svelte';
  import LogoutIcon from '../ui/icons/LogoutIcon.svelte'; // Creeremo questa nuova icona

  async function handleLogout() {
    isSidebarOpen.set(false);
    if ($user?.id === 'demo-user') {
      user.set(null);
      push('/login');
    } else {
      await supabase.auth.signOut();
    }
  }

  function onNavigate() {
    if (window.innerWidth < 1024) {
      isSidebarOpen.set(false);
    }
  }

  // Dati fittizi per la sezione "Riepilogo"
  const plantCount = 5; // In futuro, questo dato potrebbe arrivare da uno store o API
</script>

<!-- Creiamo una nuova icona per il logout per coerenza -->
<svelte:head>
  {@html `
    <script>
      // Definiamo qui l'SVG di LogoutIcon per non creare un altro file
      window.LogoutIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>';
    </script>
  `}
</svelte:head>

<aside class="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg w-64 p-0">
  <!-- Header -->
  <div class="p-4 pt-6 mb-4">
    <a href="/dashboard" use:link on:click={onNavigate} class="flex items-center space-x-3 px-2">
      <div class="w-9 h-9 text-green-500"><LeafIcon /></div>
      <span class="text-2xl font-semibold text-gray-800 dark:text-gray-100">FloraFriend</span>
    </a>
    <!-- Pulsante di chiusura visibile solo su mobile (lg:hidden) -->
    <button on:click={() => isSidebarOpen.set(false)} class="lg:hidden absolute top-5 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Chiudi menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
  </div>

  <!-- Navigazione Principale -->
  <nav class="flex-grow px-2">
    <ul class="space-y-1">
      <li>
        <a href="/dashboard" use:link on:click={onNavigate} class:active={$location === '/dashboard'} class="nav-link">
          <span class="w-6 h-6"><HomeIcon /></span>
          <span class="text-sm font-medium">Dashboard</span>
        </a>
      </li>
      <li>
        <a href="/profile" use:link on:click={onNavigate} class:active={$location.startsWith('/profile')} class="nav-link">
          <span class="w-6 h-6"><UserCircleIcon /></span>
          <span class="text-sm font-medium">Profilo</span>
        </a>
      </li>
    </ul>
  </nav>

  <!-- Sezione Riepilogo in fondo -->
  <div class="px-4 mb-4" transition:slide>
    <div class="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-xl text-sm">
      <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1">Il Tuo Giardino</p>
      <p class="text-gray-500 dark:text-gray-400">Hai <span class="font-bold text-green-600 dark:text-green-400">{plantCount}</span> piante.</p>
    </div>
  </div>


  <!-- Sezione Utente e Logout -->
  {#if $user}
  <div class="border-t border-gray-200 dark:border-gray-700 p-2">
    <a href="/profile" use:link on:click={onNavigate} class="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <img 
            src={$user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent($user.user_metadata?.name || $user.email)}&background=random`} 
            alt="Avatar utente" 
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
        >
        <div class="ml-3 flex-1 overflow-hidden">
            <p class="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">{$user.user_metadata?.full_name || $user.user_metadata?.name || 'Utente'}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{$user.email}</p>
        </div>
    </a>
    <button on:click={handleLogout} class="w-full flex items-center space-x-3 mt-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40">
      <span class="w-6 h-6">
        {@html window.LogoutIcon}
      </span>
      <span>Logout</span>
    </button>
  </div>
  {/if}
</aside>

<style>
  .nav-link {
    @apply flex w-full items-center gap-4 rounded-e-full py-3 ps-4 transition-colors duration-150 text-gray-600 dark:text-gray-300;
  }
  .nav-link:hover {
    @apply bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-gray-50;
  }
  .nav-link.active {
    @apply bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold;
    /* Rimuoviamo il padding sinistro per far "entrare" la forma */
    padding-left: 1rem; /* ps-4 */
    /* Aggiungiamo un bordo per l'indicatore attivo */
    border-left: 4px solid;
    @apply border-green-500;
  }
</style>