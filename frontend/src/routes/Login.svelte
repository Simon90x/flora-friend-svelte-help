<script>
  import { supabase } from '../lib/services/supabaseClient.js';
  import { user } from '../lib/stores/index.js';
  import { push, link } from 'svelte-spa-router';
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      // Successo! onAuthStateChange in App.svelte si occuperÃ  del redirect a /dashboard
    } catch (e) {
      error = e.message || 'Credenziali non valide o errore di rete.';
    } finally {
      loading = false;
    }
  }

  function handleDemoLogin() {
    user.set({
      id: 'demo-user',
      email: 'demo@xxx.com',
      created_at: new Date().toISOString(),
      user_metadata: { name: 'Utente Demo' }
    });
    push('/dashboard'); // Naviga manualmente alla dashboard
  }
</script>

<div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
  <!-- Header -->
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-green-600">Flora Friend</h1>
    <p class="text-gray-600 dark:text-gray-300 mt-1">Bentornato! Accedi al tuo account.</p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleLogin} class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        placeholder="nome@esempio.com"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        placeholder="La tua password"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {#if error}
      <p class="text-sm text-red-600" role="alert">{error}</p>
    {/if}

    <!-- Pulsanti -->
    <div class="space-y-4">
      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {loading ? 'Caricamento...' : 'Accedi'}
      </button>
      <button
        type="button"
        on:click={handleDemoLogin}
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Accedi in modalitÃ  demo
      </button>
    </div>
  </form>

  <!-- Link Registrazione -->
  <div class="text-center mt-6">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Non hai un account?
      <a href="/register" use:link class="font-medium text-green-600 hover:text-green-500">
        Registrati
      </a>
    </p>
  </div>
</div>