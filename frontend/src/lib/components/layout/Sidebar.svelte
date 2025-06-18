<script>
  import { user, isSidebarOpen } from '../../stores/index.js';
  import { supabase } from '../../services/supabaseClient.js';
  import { link, location } from 'svelte-spa-router';
  import { push } from 'svelte-spa-router';
import HomeIcon from '../ui/icons/HomeIcon.svelte';
import UserCircleIcon from '../ui/icons/UserCircleIcon.svelte';
import LeafIcon from '../ui/icons/LeafIcon.svelte'; // Assumendo esista

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
    // Chiudi la sidebar dopo la navigazione su mobile
    if (window.innerWidth < 1024) {
      isSidebarOpen.set(false);
    }
  }
</script>

<aside class="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg w-64 p-4">
  <div class="flex justify-between items-center text-center mb-8">
    <a href="/dashboard" use:link on:click={onNavigate} class="flex items-center justify-center space-x-2">
         <div class="w-8 h-8 text-green-600"><LeafIcon /></div>
      <span class="text-2xl font-bold text-green-600">FloraFriend</span>
    </a>
    <!-- Pulsante di chiusura visibile solo su mobile (lg:hidden) -->
    <button on:click={() => isSidebarOpen.set(false)} class="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Chiudi menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
  </div>

  <nav class="flex-grow">
    <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
    <ul class="space-y-1">
      <li>
        <a href="/dashboard" use:link on:click={onNavigate} class:active={$location === '/dashboard'} class="flex items-center justify-left space-x-2 nav-link">
             <div class="w-8 h-8 text-green-600"><HomeIcon /></div>
          <span class="text-2xl font-bold text-green-600">Dashboard</span>
        </a>
      </li>
      <li>
        <a href="/profile" use:link on:click={onNavigate} class:active={$location.startsWith('/profile')} class="flex items-center justify-left space-x-2 nav-link">
          <div class="w-8 h-8 text-green-600"><UserCircleIcon /></div>
          <span class="text-2xl font-bold text-green-600">Profilo</span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="mb-4">
    <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personalizza</h3>
    <p class="px-4 text-sm text-gray-400">Opzioni tema in arrivo...</p>
  </div>

  {#if $user}
  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
    <a href="/profile" use:link on:click={onNavigate} class="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                <img 
                    src={$user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent($user.user_metadata?.name || $user.email)}&background=random`} 
                    alt="Avatar utente" 
                    class="w-10 h-10 rounded-full object-cover"
                >
            </div>
            <div class="flex-1 overflow-hidden">
                <p class="font-semibold truncate">{$user.user_metadata?.full_name || $user.user_metadata?.name || 'Utente'}</p>
                <p class="text-xs text-gray-500 truncate">{$user.email}</p>
            </div>
        </div>
    </a>
    <button on:click={handleLogout} class="mt-4 w-full text-left px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300">
      Logout
    </button>
  </div>
  {/if}
</aside>

<style>
  .nav-link {
    @apply w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors;
  }
  .nav-link.active {
    @apply bg-green-100 dark:bg-green-900/60 font-semibold text-green-700 dark:text-green-200;
  }
</style>