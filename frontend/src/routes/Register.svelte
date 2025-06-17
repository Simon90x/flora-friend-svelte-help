<script>
  import { supabase } from '../lib/services/supabaseClient.js';
  import { page } from '../lib/stores/index.js';

  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let successMessage = '';
  let loading = false;

  async function handleRegister() {
    loading = true;
    error = '';
    successMessage = '';
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Puoi passare dati aggiuntivi che verranno salvati in user_metadata
          data: {
            full_name: name,
          }
        }
      });
      if (signUpError) throw signUpError;
      
      // Controlla se l'utente è stato creato ma richiede conferma email
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        successMessage = 'Registrazione quasi completata! Controlla la tua email per il link di conferma.';
      } else {
        // Se la conferma non è richiesta, onAuthStateChange in App.svelte farà il resto
        successMessage = 'Registrazione completata! Verrai reindirizzato a breve.';
      }

    } catch (e) {
      error = e.message || 'Errore durante la registrazione.';
    } finally {
      loading = false;
    }
  }

  function goToLogin() {
    $page = 'login';
  }
</script>

<div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
  <!-- Header -->
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-green-600">Crea un Account</h1>
    <p class="text-gray-600 dark:text-gray-300 mt-1">Unisciti a Flora Friend!</p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleRegister} class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
      <input id="name" type="text" bind:value={name} required placeholder="Il tuo nome" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
      <input id="email" type="email" bind:value={email} required placeholder="nome@esempio.com" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
      <input id="password" type="password" bind:value={password} required placeholder="Minimo 6 caratteri" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}
    {#if successMessage}
      <p class="text-sm text-green-600" role="status">{successMessage}</p>
    {/if}

    <button type="submit" disabled={loading || successMessage} class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
      {loading ? 'Registrazione...' : 'Registrati'}
    </button>
  </form>

  <!-- Link Login -->
  <div class="text-center mt-6">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Hai già un account?
      <button on:click={goToLogin} class="font-medium text-green-600 hover:text-green-500">
        Accedi
      </button>
    </p>
  </div>
</div>