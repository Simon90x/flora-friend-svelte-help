<script>
  import { user, isSidebarOpen } from '../../stores/index.js';
  import { supabase } from '../../services/supabaseClient.js';
  import { link, location } from 'svelte-spa-router';
  import { push } from 'svelte-spa-router';

  async function handleLogout() {
    isSidebarOpen.set(false);
    if ($user?.id === 'demo-user') {
      user.set(null);
      push('/login');
    } else {
      await supabase.auth.signOut();
      // onAuthStateChange in App.svelte gestirÃ  il redirect
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
        <a href="/dashboard" use:link on:click={onNavigate} class:active={$location.startsWith('/dashboard')} class="nav-link">
          Dashboard
        </a>
      </li>
      <li>
        <a href="/profile" use:link on:click={onNavigate} class:active={$location.startsWith('/profile')} class="nav-link">
          Profilo
        </a>
      </li>
       <!-- Esempio link a dettaglio pianta, per mostrare lo stato attivo -->
      <li>
        <a href="/plant/demo-plant-1" use:link on:click={onNavigate} class:active={$location.startsWith('/plant/')} class="nav-link">
         Dettaglio Pianta (Demo)
        </a>
      </li>
    </ul>
  </nav>

  <!-- Sezione Personalizzazione UI -->
  <div class="mb-4">
    <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personalizza</h3>
    <!-- Qui andranno i componenti per tema, lingua, etc. -->
    <p class="px-4 text-sm text-gray-400">Opzioni tema in arrivo...</p>
  </div>

  {#if $user}
  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
    <div class="flex items-center space-x-3 mb-4 px-2">
      <div class="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
        {$user.user_metadata?.full_name?.charAt(0) || $user.user_metadata?.name?.charAt(0) || $user.email.charAt(0).toUpperCase()}
      </div>
      <div class="flex-1 overflow-hidden">
        <p class="font-semibold truncate">{$user.user_metadata?.full_name || $user.user_metadata?.name || 'Utente'}</p>
        <p class="text-xs text-gray-500 truncate">{$user.email}</p>
      </div>
    </div>
    <button on:click={handleLogout} class="w-full text-left px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300">
      Logout
    </button>
  </div>
  {/if}
</aside>

<style>
  .nav-link {
    @apply w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 block transition-colors;
  }
  .nav-link.active {
    @apply bg-green-100 dark:bg-green-900/60 font-semibold text-green-700 dark:text-green-200;
  }
</style>