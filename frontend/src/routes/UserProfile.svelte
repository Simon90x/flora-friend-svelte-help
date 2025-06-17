<script>
    import { user } from '../lib/stores/index.js';
    import { supabase } from '../lib/services/supabaseClient.js';
    import { push } from 'svelte-spa-router';

    import Button from '../lib/components/ui/Button.svelte';

    let fullName = $user.user_metadata?.full_name || '';
    let newPassword = '';
    let confirmPassword = '';
    let currentPasswordForDelete = '';
    
    let isLoading = false;
    let successMessage = '';
    let errorMessage = '';

    async function updateProfile() {
        isLoading = true;
        errorMessage = '';
        successMessage = '';
        // MOCK API: PATCH /auth/v1/user
        // Payload: { "data": { "full_name": "Nuovo Nome" } }
        const { data, error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });
        if (error) {
            errorMessage = `Errore aggiornamento profilo: ${error.message}`;
        } else {
            user.set(data.user); // Aggiorna lo store globale
            successMessage = 'Profilo aggiornato con successo!';
        }
        isLoading = false;
    }

    async function deleteAccount() {
        if (!confirm("Sei assolutamente sicuro? Questa azione è irreversibile e cancellerà tutti i tuoi dati.")) {
            return;
        }
        isLoading = true;
        // Questa è una custom RPC function 'delete_user_account' che andrà creata su Supabase
        // per garantire che la password sia corretta prima di procedere.
        // MOCK API: POST /rest/v1/rpc/delete_user_account
        // Payload: { "current_password": "password_attuale" }
        const { error } = await supabase.rpc('delete_user_account', { password: currentPasswordForDelete });

        if (error) {
            errorMessage = `Errore eliminazione account: ${error.message}`;
        } else {
            // Logout forzato e reindirizzamento
            await supabase.auth.signOut();
            push('/login');
        }
        isLoading = false;
    }
</script>

<div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Il Tuo Profilo</h1>
    
    <!-- Sezione Informazioni Account -->
    <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Informazioni Account</h2>
        <form on:submit|preventDefault={updateProfile} class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" id="email" value={$user.email} disabled class="mt-1 w-full input bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
            </div>
            <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                <input type="text" id="fullName" bind:value={fullName} required class="mt-1 w-full input">
            </div>
            <div class="text-right">
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvataggio...' : 'Salva Modifiche'}</Button>
            </div>
        </form>
    </section>

    <!-- Sezione Sicurezza (Placeholder per cambio password) -->
    <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Sicurezza</h2>
        <p class="text-gray-500">Per cambiare la password, ti verrà inviata una mail di reset.</p>
        <!-- L'implementazione completa richiederebbe un flusso di password reset -->
        <Button variant="secondary" on:click={() => supabase.auth.resetPasswordForEmail($user.email)}>Invia link reset password</Button>
    </section>

    <!-- Zona Pericolosa -->
    <section class="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-300 dark:border-red-800">
        <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Zona Pericolosa</h2>
        <p class="text-red-600 dark:text-red-300 mb-4">L'eliminazione del tuo account cancellerà permanentemente tutte le tue piante, log e dati associati.</p>
        <div class="flex items-center gap-4">
             <input type="password" bind:value={currentPasswordForDelete} placeholder="Password attuale per conferma" class="input flex-grow">
             <Button variant="ghost" on:click={deleteAccount} disabled={isLoading || !currentPasswordForDelete} className="bg-red-600 text-white hover:bg-red-700">
                 {isLoading ? 'Eliminazione...' : 'Elimina il mio account'}
             </Button>
        </div>
    </section>

    {#if successMessage}
      <p class="text-green-600">{successMessage}</p>
    {/if}
    {#if errorMessage}
      <p class="text-red-600">{errorMessage}</p>
    {/if}
</div>

<style>
  .input {
    @apply block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>