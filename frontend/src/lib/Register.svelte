<script>
  import { supabase } from '../lib/supabaseClient.js';
  import { user } from './stores';
  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  function handleRegister(event) {
    event.preventDefault();
    loading = true;
    error = '';
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
      .then(result => {
        loading = false;
        if (result.error) {
          error = result.error.message;
        } else {
          // Per semplicità, settiamo l'utente e reindirizziamo al dashboard
          user.set({ id: result.data.user.id, email, name });
          window.location.href = '/dashboard';
        }
      })
      .catch(err => {
        loading = false;
        error = err.message;
      });
  }
</script>

<form on:submit|preventDefault={handleRegister} aria-label="Registration form">
  <div>
    <label for="name">Nome</label>
    <input id="name" type="text" bind:value={name} required autocomplete="name" />
  </div>
  <div>
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} required autocomplete="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} required autocomplete="new-password" />
  </div>
  {#if error}
    <div role="alert" style="color: red;">{error}</div>
  {/if}
  <button type="submit" disabled={loading}>
    {#if loading}Registrando...{/if}
    {#if !loading}Registrati{/if}
  </button>
  <!-- Link per tornare alla login -->
  <button type="button" on:click={() => window.location.href = '/'}>Torna al Login</button>
</form>