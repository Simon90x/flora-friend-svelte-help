<script>
  import { user, isSidebarOpen } from '../../stores/index.js';
  import { supabase } from '../../services/supabaseClient.js';
  import { link, location, push } from 'svelte-spa-router';

  import LeafIcon from '../ui/icons/LeafIcon.svelte';
  import HomeIcon from '../ui/icons/HomeIcon.svelte';
  import UserCircleIcon from '../ui/icons/UserCircleIcon.svelte';
  import LogoutIcon from '../ui/icons/LogoutIcon.svelte';

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

  const plantCount = 5;
</script>

<aside class="flex flex-col h-screen sticky top-0 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 shadow-2xl w-70">
  <!-- Header -->
  <div class="p-4 pt-6 mb-4 flex-shrink-0 relative">
    <a href="/dashboard" use:link on:click={onNavigate} class="flex items-center space-x-3 px-2">
      <div class="w-9 h-9 text-green-500"><LeafIcon /></div>
      <span class="text-4xl font-semibold text-gray-800 dark:text-gray-100">FloraFriend</span>
    </a>
    <button
      on:click={() => isSidebarOpen.set(false)}
      class="lg:hidden absolute top-5 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      aria-label="Chiudi menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Navigazione -->
  <nav class="flex-grow px-2 overflow-y-auto">
    <ul class="space-y-6">
      <li>
        <a
          href="/dashboard"
          use:link
          on:click={onNavigate}
          class="flex items-center space-x-3 px-2 transition-colors hover:text-gray-900 dark:hover:text-gray-50"
          class:font-semibold={$location === '/dashboard'}
          class:text-green-700={$location === '/dashboard'}
          class:dark\:text-green-300={$location === '/dashboard'}
        >
          <div class="w-6 h-6"><HomeIcon /></div>
          <span class="text-lg font-medium">Dashboard</span>
        </a>
      </li>
      <li>
        <a
          href="/profile"
          use:link
          on:click={onNavigate}
          class="flex items-center space-x-3 px-2 transition-colors hover:text-gray-900 dark:hover:text-gray-50"
          class:font-semibold={$location.startsWith('/profile')}
          class:text-green-700={$location.startsWith('/profile')}
          class:dark\:text-green-300={$location.startsWith('/profile')}
        >
          <div class="w-6 h-6"><UserCircleIcon /></div>
          <span class="text-lg font-medium">Profilo</span>
        </a>
      </li>
    </ul>
  </nav>

  <!-- Footer -->
  <div class="mt-auto p-2 flex-shrink-0">
    <div class="px-2 mb-2">
      <div class="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-xl text-sm">
        <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1">Il Tuo Giardino</p>
        <p class="text-gray-500 dark:text-gray-400">
          Hai <span class="font-bold text-green-600 dark:text-green-400">{plantCount}</span> piante.
        </p>
      </div>
    </div>

    {#if $user}
      <div class="border-t border-gray-200 dark:border-gray-700 p-2">
        <a
          href="/profile"
          use:link
          on:click={onNavigate}
          class="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <img
            src={$user.user_metadata?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(($user.user_metadata?.full_name || $user.user_metadata?.name) || $user.email)}&background=random`}
            alt="Avatar utente"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div class="ml-3 flex-1 overflow-hidden">
            <p class="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">
              {($user.user_metadata?.full_name || $user.user_metadata?.name) || 'Utente'}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{$user.email}</p>
          </div>
        </a>
        <button
          on:click={handleLogout}
          class="w-full flex items-center space-x-3 mt-2 text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40"
        >
          <LogoutIcon class="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    {/if}
  </div>
</aside>
