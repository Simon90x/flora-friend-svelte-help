<script>
  import { user } from '../lib/stores/index.js';
  import { mockApi } from '../lib/services/mockData.js';
  import { push } from 'svelte-spa-router';

  import Button from '../lib/components/ui/Button.svelte';
  import ImageInput from '../lib/components/ui/ImageInput.svelte';
  import ConfirmationModal from '../lib/components/modals/ConfirmationModal.svelte';
  import ImageEditorModal from '../lib/components/modals/ImageEditorModal.svelte';
  import { toast } from '../lib/stores/notifications.js'; // 1. Importa l'helper
  import Breadcrumbs from '../lib/components/ui/Breadcrumbs.svelte'; // 1. Importa

  let currentUser;
  user.subscribe((u) => (currentUser = u));

  const isDemo = currentUser.id === 'demo-user';
  const registrationDate = isDemo ? new Date() : new Date(currentUser.created_at);

  // Stato per la modifica
  let isEditingName = false;
  let newName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
  let newAvatarBase64 = currentUser.user_metadata?.avatar_url || null;

  // Stato per le modali
  let isConfirmDeleteOpen = false;
  let isEditorOpen = false;
  let imageToEdit = null;

  async function handleSaveName() {
    if (!newName.trim()) return;
    await mockApi.updateUserProfile({ name: newName, full_name: newName });
    isEditingName = false;
  }

  function handleAvatarChange(event) {
    newAvatarBase64 = event.detail.base64;
  }

  function openEditor() {
    imageToEdit = newAvatarBase64;
    isEditorOpen = true;
  }

  function handleSaveEditedImage(event) {
    newAvatarBase64 = event.detail;
    imageToEdit = null;
  }

  async function handleSaveAvatar() {
    await mockApi.updateUserProfile({ avatar_url: newAvatarBase64 });

    // 3. Aggiungi la nuova notifica
    toast.push('Avatar aggiornato con successo!', { type: 'success' });
  }

  async function handleDeleteAccount() {
    await mockApi.deleteUser();
    push('/login');
  }

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profilo Utente' }];
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <ImageEditorModal
    isOpen={isEditorOpen}
    imageBase64={imageToEdit}
    on:close={() => (isEditorOpen = false)}
    on:save={(e) => handleSaveEditedImage(e)}
  />
  <ConfirmationModal
    isOpen={isConfirmDeleteOpen}
    title="Elimina Account"
    message="Sei davvero sicuro? Tutti i tuoi dati (piante, log, foto) verranno eliminati permanentemente. Questa azione è irreversibile."
    confirmText="Sì, elimina tutto"
    onConfirm={handleDeleteAccount}
    onCancel={() => (isConfirmDeleteOpen = false)}
  />
  <Breadcrumbs items={breadcrumbItems} />

  <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Profilo Utente</h1>

  {#if isDemo}
    <div
      class="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4 rounded-lg"
      role="alert"
    >
      <p class="font-bold">Modalità Demo</p>
      <p>
        Stai visualizzando un profilo dimostrativo. Le modifiche non verranno salvate in un
        database, ma l'interfaccia reagirà come se lo facessero. Il "Cambio Password" è
        disabilitato.
      </p>
    </div>
  {/if}

  <!-- Sezione Informazioni Account -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-6">Informazioni Account</h2>
    <div class="space-y-6">
      <!-- Avatar -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-2">Avatar</label>
        <div class="flex items-center space-x-4">
          <img
            src={newAvatarBase64 ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.user_metadata?.name || currentUser.email)}&background=random`}
            alt="Avatar utente"
            class="w-20 h-20 rounded-full object-cover bg-gray-200"
          />
          <ImageInput label="" on:imageChange={handleAvatarChange} />
        </div>
        {#if newAvatarBase64}
          <div class="mt-4 flex space-x-2">
            <Button on:click={openEditor} variant="secondary" size="sm">Modifica Immagine</Button>
            <Button on:click={handleSaveAvatar} variant="primary" size="sm">Salva Avatar</Button>
          </div>
        {/if}
      </div>

      <!-- Nome -->
      <div>
        <label class="block text-sm font-medium text-gray-500">Nome</label>
        {#if isEditingName}
          <div class="flex items-center space-x-2 mt-1">
            <input type="text" bind:value={newName} class="w-full max-w-xs input" />
            <Button on:click={handleSaveName} size="sm">Salva</Button>
            <Button on:click={() => (isEditingName = false)} variant="ghost" size="sm"
              >Annulla</Button
            >
          </div>
        {:else}
          <div class="flex items-center space-x-4">
            <p class="text-lg">
              {currentUser.user_metadata?.full_name ||
                currentUser.user_metadata?.name ||
                'Utente Demo'}
            </p>
            <button
              on:click={() => (isEditingName = true)}
              class="text-sm text-green-600 hover:underline">Modifica</button
            >
          </div>
        {/if}
      </div>

      <!-- Email (non modificabile) -->
      <div>
        <label class="block text-sm font-medium text-gray-500">Email</label>
        <p class="text-lg text-gray-400">{currentUser.email}</p>
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
    <Button on:click={() => alert('Funzionalità non implementata.')} disabled={isDemo}>
      Cambia Password
    </Button>
  </div>

  <!-- Zona Pericolosa -->
  <div
    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg"
  >
    <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">Zona Pericolosa</h2>
    <p class="text-red-700 dark:text-red-300 mb-4">
      Questa azione è irreversibile e cancellerà il tuo account demo.
    </p>
    <Button
      variant="ghost"
      on:click={() => (isConfirmDeleteOpen = true)}
      className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    >
      Elimina Account
    </Button>
  </div>
</div>

<style>
  .input {
    @apply px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>
