<!-- src/routes/Login.svelte -->
<script>
  import { supabase } from '../lib/supabaseClient.js';
  import { onMount } from 'svelte';
  import { user } from './stores';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  // Gestisce il submit del form di login
  async function handleLogin(event) {
    event.preventDefault();
    loading = true;
    error = '';
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    loading = false;
    if (loginError) {
      error = loginError.message;
    } else {
      // Login riuscito
      user.set(data.user);
      window.location.href = '/dashboard'; // Reindirizza al dashboard
    }
  }

  // Funzione per la modalità demo
  function handleDemo() {
    // Dati fittizi dell'utente demo
    user.set({ id: 'demo', email: 'demo@example.com', name: 'Demo User' });
    window.location.href = '/dashboard'; // Reindirizza al dashboard
  }

  // Naviga alla pagina di registrazione
  function goToRegister() {
    window.location.href = '/register';
  }
</script>

<!-- 
  Layout principale: sfondo grigio chiaro, contenitore centrato verticalmente e orizzontalmente.
  Simile a `min-h-screen flex items-center justify-center bg-light-bg` dell'esempio React.
-->
<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
  
  <!-- 
    Card di login: sfondo bianco, angoli arrotondati, ombra, padding.
    Simile a `w-full max-w-md bg-panel-bg p-8 rounded-xl shadow-xl`
  -->
  <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg relative">
    
    <!-- Header della card: logo, nome dell'app e sottotitolo -->
    <div class="flex flex-col items-center mb-8 pt-8 sm:pt-0">
      <!-- Icona Foglia (presa da Heroicons) -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 class="text-3xl font-bold text-green-600">FloraFriend</h1>
      <p class="text-gray-600 mt-1">Bentornato! Accedi al tuo account.</p>
    </div>

    <!-- Form di Login -->
    <form on:submit|preventDefault={handleLogin} class="space-y-6" aria-label="Login form">
      
      <!-- Campo Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            placeholder="nome@esempio.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      
      <!-- Campo Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            autocomplete="current-password"
            placeholder="La tua password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <!-- Messaggio di errore -->
      {#if error}
        <div class="flex items-center text-sm text-red-700 bg-red-100 p-3 rounded-md" role="alert">
          <!-- Icona ExclamationTriangle -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      {/if}

      <!-- Pulsante di Submit -->
      <div>
        <button
          type="submit"
          disabled={loading}
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <!-- Spinner di caricamento -->
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Caricamento...
          {:else}
            Accedi
          {/if}
        </button>
      </div>
    </form>

    <!-- Bottone per accedere in modalità demo -->
    <div class="mt-4">
      <button
        type="button"
        on:click={handleDemo}
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
      >
        Accedi in modalità demo
      </button>
    </div>

    <!-- Link per la registrazione -->
    <div class="account-section mt-4">
      Non hai un account?
      <button class="register-link" on:click={goToRegister}>Registrati</button>
    </div>

  </div>

  <!-- Footer -->
  <p class="mt-8 text-xs text-gray-500 text-center">
    © {new Date().getFullYear()} FloraFriend. Tutti i diritti riservati.
  </p>
</div>