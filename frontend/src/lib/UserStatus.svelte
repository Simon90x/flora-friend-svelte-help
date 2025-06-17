<script>
  import { user } from './stores';
     import '../app.css';
  import { supabase } from './supabaseClient';
  let currentUser;
  $: user.subscribe(u => currentUser = u);

  async function handleLogout() {
    await supabase.auth.signOut();
    user.set(null);
  }
</script>

{#if currentUser}
  <p>Benvenuto, {currentUser.email}!</p>
  <button class="btn" on:click={handleLogout}>Logout</button>
{:else}
  <p>Non sei autenticato.</p>
{/if}
