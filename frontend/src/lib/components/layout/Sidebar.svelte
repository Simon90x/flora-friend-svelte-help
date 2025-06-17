<script>
  import { page, user, isSidebarOpen } from '../../stores.js';
  import { supabase } from '../../supabaseClient.js';

  let currentUser;
  user.subscribe(u => currentUser = u);

  async function handleLogout() {
    isSidebarOpen.set(false); // Chiudi la sidebar prima del logout
    if ($user?.id === 'demo-user') {
      user.set(null);
    } else {
      await supabase.auth.signOut();
    }
  }

  function navigate(destination) {
    $page = destination;
    isSidebarOpen.set(false); // Chiudi la sidebar dopo la navigazione
  }
</script>

<!-- Contenitore della Sidebar -->
<aside class="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg w-64 p-4">
  
  <!-- Header con logo e nome app -->
  <div class="text-center mb-8">
    <a href="/" on:click|preventDefault={() => navigate('dashboard')} class="flex items-center justify-center space-x-2">
      <!-- Qui puoi mettere un'icona SVG come LeafIcon -->
      <span class="text-2xl font-bold text-green-600">FloraFriend</span>
    </a>
  </div>

  <!-- Navigazione Principale -->
  <nav class="flex-grow">
    <ul class="space-y-2">
      <li>
        <button on:click={() => navigate('dashboard')} class:font-bold={$page === 'dashboard'} class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          Dashboard
        </button>
      </li>
      <li>
        <button on:click={() => navigate('profile')} class:font-bold={$page === 'profile'} class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          Profilo
        </button>
      </li>
    </ul>
  </nav>

  <!-- Sezione Utente e Logout -->
  {#if currentUser}
  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
    <div class="flex items-center space-x-3 mb-4">
      <!-- Avatar Placeholder -->
      <div class="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
        {currentUser.user_metadata?.full_name?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
      </div>
      <div class="flex-1 overflow-hidden">
        <p class="font-semibold truncate">{currentUser.user_metadata?.full_name || 'Utente'}</p>
        <p class="text-xs text-gray-500 truncate">{currentUser.email}</p>
      </div>
    </div>
    <button on:click={handleLogout} class="w-full text-left px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300">
      Logout
    </button>
  </div>
  {/if}

</aside>