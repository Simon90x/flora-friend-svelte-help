<!-- src/routes/Register.svelte -->
<script>
  import { page } from '../lib/stores.js';
</script>

<div class="p-8">
  <h1 class="text-2xl font-bold">Pagina di Registrazione</h1>
  <p>Qui andrà il form di registrazione.</p>
  <button on:click={() => $page = 'login'} class="text-green-600 hover:underline mt-4">
    Torna al Login
  </button>
</div>