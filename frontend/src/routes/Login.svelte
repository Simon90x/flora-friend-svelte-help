<!-- src/routes/Login.svelte -->
<script>
  import { supabase } from '../lib/supabaseClient.js';
  import { page } from '../lib/stores.js'; // Importa lo store 'page'

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
        password
      });
      if (loginError) throw loginError;
      // Non c'è bisogno di fare altro, onAuthStateChange in App.svelte farà il resto!
    } catch (e) {
      error = e.message || 'Errore durante il login.';
    } finally {
      loading = false;
    }
  }

  function goToRegister() {
    $page = 'register'; // Cambia pagina usando lo store
  }
</script>

<!-- Il tuo HTML per il login va qui. Assicurati che i gestori on:click siano corretti -->
<!-- Esempio di pulsante di registrazione: -->
<button on:click={goToRegister}>Registrati</button>