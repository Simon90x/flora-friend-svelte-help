<script>
  import { user } from './stores';
  import '../app.css';
  let currentUser;
  $: user.subscribe((u) => (currentUser = u));

  function backToDashboard() {
    import('./navigation').then(({ page }) => page.set('dashboard'));
  }
</script>

<h2>Profilo Utente</h2>
{#if currentUser}
  <p>Nome: {currentUser.user_metadata?.full_name || 'N/A'}</p>
  <p>Email: {currentUser.email}</p>
  <button class="btn" on:click={backToDashboard}>Torna alla dashboard</button>
  <p>Sezioni modifica profilo, avatar, sicurezza, preferenze: placeholder</p>
{:else}
  <p>Utente non autenticato.</p>
{/if}
