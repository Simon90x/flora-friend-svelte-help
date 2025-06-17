<script>
  import { user, isSidebarOpen } from '../../stores/index.js';
  import { supabase } from '../../services/supabaseClient.js';
  import { link, location } from 'svelte-spa-router';

  async function handleLogout() {
    isSidebarOpen.set(false);
    if ($user?.id === 'demo-user') {
      user.set(null);
      // 'push' non è necessario qui perché l'App.svelte guard reindirizzerà
    } else {
      await supabase.auth.signOut();
    }
  }

  function onNavigate() {
    isSidebarOpen.set(false); // Chiudi la sidebar dopo la navigazione
  }
</script>

<aside class="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg w-64 p-4">
  <div class="text-center mb-8">
    <a href="/dashboard" use:link on:click={onNavigate} class="flex items-center justify-center space-x-2">
      <span class="text-2xl font-bold text-green-600">FloraFriend</span>
    </a>
  </div>

  <nav class="flex-grow">
    <ul class="space-y-2">
      <li>
        <a href="/dashboard" use:link on:click={onNavigate} class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 block" class:font-bold={$location === '/dashboard'}>
          Dashboard
        </a>
      </li>
      <li>
        <a href="/profile" use:link on:click={onNavigate} class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 block" class:font-bold={$location === '/profile'}>
          Profilo
        </a>
      </li>
    </ul>
  </nav>

  <!-- TODO: Aggiungere sezioni per personalizzazione UI come da specifiche -->

  {#if $user}
  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
        {$user.user_metadata?.full_name?.charAt(0) || $user.email.charAt(0).toUpperCase()}
      </div>
      <div class="flex-1 overflow-hidden">
        <p class="font-semibold truncate">{$user.user_metadata?.full_name || 'Utente'}</p>
        <p class="text-xs text-gray-500 truncate">{$user.email}</p>
      </div>
    </div>
    <button on:click={handleLogout} class="w-full text-left px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300">
      Logout
    </button>
  </div>
  {/if}
</aside>