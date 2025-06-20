<script>
  import { onMount } from 'svelte';
  import { user } from '../lib/stores/index.js';
  // RIMOSSO: mockApi non è più usato direttamente
  // import { mockApi } from '../lib/services/mockData.js';
  import { push } from 'svelte-spa-router';

  // AGGIUNTO: La nostra API centralizzata
  import { api } from '../lib/services/api.js';
  
  // Importazioni componenti e helper (invariate)
  import Button from '../lib/components/ui/Button.svelte';
  import ImageInput from '../lib/components/ui/ImageInput.svelte';
  import ConfirmationModal from '../lib/components/modals/ConfirmationModal.svelte';
  import ImageEditorModal from '../lib/components/modals/ImageEditorModal.svelte';
  import { toast } from '../lib/stores/notifications.js';
  import Breadcrumbs from '../lib/components/ui/Breadcrumbs.svelte';

  let currentUser;
  user.subscribe((u) => (currentUser = u));

  const isDemo = currentUser?.id === 'demo-user';
  const registrationDate = isDemo ? new Date() : new Date(currentUser.created_at);

  // Stato per la modifica e l'avatar
  let isEditingName = false;
  let newName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '';
  let avatarPreview = currentUser.user_metadata?.avatar_url || null;
  let newAvatarBase64 = null; // Contiene solo la *nuova* immagine caricata

  // Stato per i loader e le modali
  let isSavingName = false;
  let isSavingAvatar = false;
  let isConfirmDeleteOpen = false;
  let isEditorOpen = false;
  let imageToEdit = null;

  // --- Funzioni di gestione UI (invariate) ---
  function handleAvatarChange(event) {
    newAvatarBase64 = event.detail.base64;
    avatarPreview = event.detail.base64; // Aggiorna l'anteprima immediatamente
  }

  function openEditor() {
    if (!avatarPreview) return;
    imageToEdit = avatarPreview;
    isEditorOpen = true;
  }

  function handleSaveEditedImage(event) {
    const editedImage = event.detail;
    newAvatarBase64 = editedImage;
    avatarPreview = editedImage;
    imageToEdit = null;
  }

  // --- Funzioni API (MODIFICATE) ---

  async function handleSaveName() {
    if (!newName.trim()) {
      toast.push('Il nome non può essere vuoto.', { type: 'error' });
      return;
    }
    isSavingName = true;
    try {
      await api.updateUserProfile({ full_name: newName });
      toast.push('Nome aggiornato con successo!', { type: 'success' });
      isEditingName = false;
    } catch (e) {
      toast.push(e.message || 'Errore durante l\'aggiornamento del nome.', { type: 'error' });
    } finally {
      isSavingName = false;
    }
  }

  async function handleSaveAvatar() {
    if (!newAvatarBase64) {
      toast.push('Nessuna nuova immagine da salvare.', { type: 'info' });
      return;
    }
    isSavingAvatar = true;
    try {
      await api.updateUserAvatar(newAvatarBase64);
      toast.push('Avatar aggiornato con successo!', { type: 'success' });
      newAvatarBase64 = null; // Resetta dopo il salvataggio
    } catch (e) {
      toast.push(e.message || 'Errore durante l\'aggiornamento dell\'avatar.', { type: 'error' });
    } finally {
      isSavingAvatar = false;
    }
  }

  async function handleDeleteAccount() {
    // La modale gestirà lo stato di caricamento.
    try {
      await api.deleteUserAccount();
      toast.push('Account eliminato. A presto!', { type: 'info' });
      // onAuthStateChange in App.svelte si occuperà del redirect a /login
    } catch (e) {
      toast.push(e.message || 'Impossibile eliminare l\'account.', { type: 'error' });
    }
  }

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profilo Utente' }];
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <ImageEditorModal
    isOpen={isEditorOpen}
    imageBase64={imageToEdit}
    on:close={() => (isEditorOpen = false)}
    on:save={handleSaveEditedImage}
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
    <!-- Messaggio Demo (invariato) -->
  {/if}

  <!-- Sezione Informazioni Account -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-6">Informazioni Account</h2>
    <div class="space-y-6">
      <!-- Avatar -->
      <div>
        <p class="block text-sm font-medium text-gray-500 mb-2">Avatar</p>
        <div class="flex items-center space-x-4">
          <img
            src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(newName || currentUser.email)}&background=random`}
            alt="Avatar utente"
            class="w-20 h-20 rounded-full object-cover bg-gray-200"
          />
          <ImageInput label="" on:imageChange={handleAvatarChange} />
        </div>
        {#if newAvatarBase64}
          <div class="mt-4 flex space-x-2">
            <Button on:click={openEditor} variant="secondary" size="sm" disabled={isSavingAvatar}>Modifica</Button>
            <Button on:click={handleSaveAvatar} variant="primary" size="sm" loading={isSavingAvatar}>Salva Avatar</Button>
          </div>
        {/if}
      </div>

      <!-- Nome -->
      <div>
        <label for="userName" class="block text-sm font-medium text-gray-500">Nome</label>
        {#if isEditingName}
          <div class="flex items-center space-x-2 mt-1">
            <input type="text" bind:value={newName} class="w-full max-w-xs input" />
            <Button on:click={handleSaveName} size="sm" loading={isSavingName}>Salva</Button>
            <Button on:click={() => (isEditingName = false)} variant="ghost" size="sm">Annulla</Button>
          </div>
        {:else}
          <div class="flex items-center space-x-4">
            <p class="text-lg">{currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Utente'}</p>
            <button on:click={() => (isEditingName = true)} class="text-sm text-green-600 hover:underline">Modifica</button>
          </div>
        {/if}
      </div>

      <!-- Email (invariato) -->
      <div>
        <p class="block text-sm font-medium text-gray-500">Email</p>
        <p class="text-lg text-gray-400">{currentUser.email}</p>
      </div>
      <div>
        <p class="block text-sm font-medium text-gray-500">Membro dal</p>
        <p class="text-lg">{registrationDate.toLocaleDateString('it-IT')}</p>
      </div>
    </div>
  </div>

  <!-- Sezione Sicurezza (invariato) -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Sicurezza</h2>
    <Button on:click={() => toast.push('Funzionalità non ancora implementata.', {type: 'info'})} disabled={isDemo}>
      Cambia Password
    </Button>
  </div>

  <!-- Zona Pericolosa (invariato) -->
  <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
    <!-- ... -->
  </div>
</div>

<style>
  .input {
    @apply px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500;
  }
</style>