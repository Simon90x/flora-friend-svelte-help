<script>
    import { user } from '../lib/stores/index.js';
    import Button from '../lib/components/ui/Button.svelte';

    let currentUser;
    user.subscribe(u => currentUser = u);

    const isDemo = $user.id === 'demo-user';
    const registrationDate = isDemo ? new Date() : new Date(currentUser.created_at);
</script>

<div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Profilo Utente</h1>

    {#if isDemo}
    <div class="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4" role="alert">
        <p class="font-bold">Modalità Demo</p>
        <p>Le informazioni del profilo sono fittizie. Le azioni come "Cambia Password" o "Elimina Account" sono disabilitate.</p>
    </div>
    {/if}

    <!-- Sezione Informazioni Account -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Informazioni Account</h2>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-500">Nome</label>
                <p class="text-lg">{currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Utente Demo'}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="text-lg">{currentUser.email}</p>
            </div>
             <div>
                <label class="block text-sm font-medium text-gray-500">Membro dal</label>
                <p class="text-lg">{registrationDate.toLocaleDateString('it-IT')}</p>
            </div>
        </div>
    </div>

    <!-- Sezione Sicurezza -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Sicurezza</h2>
        <Button on:click={() => alert('Funzionalità non disponibile in demo.')} disabled={isDemo}>
            Cambia Password
        </Button>
    </div>
    
    <!-- Zona Pericolosa -->
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">Zona Pericolosa</h2>
        <p class="text-red-700 dark:text-red-300 mb-4">Questa azione è irreversibile e cancellerà tutti i tuoi dati.</p>
        <Button variant="ghost" on:click={() => alert('Funzionalità non disponibile in demo.')} disabled={isDemo} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
            Elimina Account
        </Button>
    </div>
</div>