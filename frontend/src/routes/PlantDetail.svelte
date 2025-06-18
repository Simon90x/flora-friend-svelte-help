<script>
  import { onMount } from 'svelte';
  import { user, selectedPlant } from '../lib/stores/index.js';
  import { mockApi } from '../lib/services/mockData.js';
  import { link, push } from 'svelte-spa-router';

  // Componenti UI e Modali
  import TabGroup from '../lib/components/ui/TabGroup.svelte';
  import Tab from '../lib/components/ui/Tab.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import Modal from '../lib/components/modals/Modal.svelte';
  import ConfirmationModal from '../lib/components/modals/ConfirmationModal.svelte';
  import ImageViewerModal from '../lib/components/modals/ImageViewerModal.svelte';

  // Tabs
  import GrowthLogsTab from '../lib/components/detail_tabs/GrowthLogsTab.svelte';
  import PhotoDiaryTab from '../lib/components/detail_tabs/PhotoDiaryTab.svelte';
  import PlantHealthTab from '../lib/components/detail_tabs/PlantHealthTab.svelte';
  import AiAdviceTab from '../lib/components/detail_tabs/AiAdviceTab.svelte';

  // Forms
  import AddLogForm from '../lib/components/forms/AddLogForm.svelte';
  import AddHealthLogForm from '../lib/components/forms/AddHealthLogForm.svelte';
  import Breadcrumbs from '../lib/components/ui/Breadcrumbs.svelte'; // 1. Importa il componente
  import PlantDetailSkeleton from '../lib/components/skeletons/PlantDetailSkeleton.svelte';

  import SpinnerIcon from '../lib/components/ui/icons/SpinnerIcon.svelte'; // 1. Importa lo spinner

  export let params = {};

  let plantDetails = null;
  let isLoading = true;
  let error = '';
  let isRevalidating = false; // 2. Nuova variabile per gli aggiornamenti in background

  // Stato per la gestione delle modali
  let isAddLogModalOpen = false;
  let isAddHealthLogModalOpen = false;
  let isDeletePlantModalOpen = false;
  let isDeletingPlant = false;
  let isImageViewerOpen = false;
  let imageViewerSource = null; // Sarà una singola immagine o un array
  async function loadPlantDetails(plantId, isInitialLoad = false) {
    if (!plantId) {
      error = 'ID della pianta non fornito.';
      isLoading = false;
      return;
    }

    if (isInitialLoad) {
      isLoading = true;
      plantDetails = null; // Resetta i dati per il caricamento iniziale
    } else {
      isRevalidating = true; // Attiva l'indicatore di ri-validazione
    }
    error = '';

    try {
      // Aggiungiamo un piccolo ritardo fittizio per rendere visibile l'effetto
      // In un'app reale non servirebbe, ma qui aiuta a vedere lo spinner.
      await new Promise((res) => setTimeout(res, 500));

      const data = await mockApi.getPlantDetails(plantId);
      if (data) {
        plantDetails = data;
        selectedPlant.set(plantDetails);
      } else {
        error = `Nessuna pianta trovata con ID: ${plantId}`;
        plantDetails = null;
      }
    } catch (e) {
      console.error('Errore nel caricamento dei dettagli della pianta:', e);
      error = 'Si è verificato un errore durante il caricamento dei dati.';
      plantDetails = null;
    } finally {
      if (isInitialLoad) {
        isLoading = false;
      }
      isRevalidating = false; // Disattiva sempre l'indicatore alla fine
    }
  }

  // 4. Modifica la chiamata iniziale
  $: if (params.id) {
    loadPlantDetails(params.id, true); // La prima volta è un caricamento iniziale
  }

  async function handleDeletePlant() {
    isDeletingPlant = true;
    await mockApi.deletePlant(plantDetails.id);
    isDeletingPlant = false;
    isDeletePlantModalOpen = false;
    push('/dashboard');
  }

  function handleUpdate() {
    loadPlantDetails(plantDetails.id, false); // Le volte successive NON sono un caricamento iniziale
  }

  function openCoverImageViewer() {
    imageViewerSource = [plantDetails.cover_image_url];
    isImageViewerOpen = true;
  }

  
function openImageViewer(event) {
    imageViewerSource = event.detail.images;
    viewerStartIndex = event.detail.startIndex || 0;
    isImageViewerOpen = true;
}

  const TABS = ['Log Crescita', 'Diario Foto', 'Salute', 'Consigli IA'];
  $: breadcrumbItems = plantDetails
    ? [
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: plantDetails.name,
        }, // L'ultimo non ha href
      ]
    : [
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
      ];


</script>

{#if isLoading}
  <PlantDetailSkeleton />
{:else if error}
  <div class="text-center p-10 bg-red-100 dark:bg-red-900/30 rounded-lg">
    <p class="text-xl text-red-700 dark:text-red-200 font-semibold">Errore</p>
    <p class="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
    <a href="/dashboard" use:link class="mt-4 inline-block text-green-600 hover:underline">
      ← Torna alla Dashboard
    </a>
  </div>
{:else if !plantDetails}
  <div class="text-center p-10">
    <p class="text-xl text-gray-500">Nessuna pianta trovata.</p>
    <a href="/dashboard" use:link class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </a>
  </div>
{:else}
  <!-- Modali di pagina -->
  <Modal isOpen={isAddLogModalOpen} onClose={() => (isAddLogModalOpen = false)} size="lg">
    <AddLogForm
      plantId={plantDetails.id}
      on:close={() => (isAddLogModalOpen = false)}
      onSuccess={() => {
        isAddLogModalOpen = false;
        handleUpdate();
      }}
    />
  </Modal>

  <Modal
    isOpen={isAddHealthLogModalOpen}
    onClose={() => (isAddHealthLogModalOpen = false)}
    size="lg"
  >
    <AddHealthLogForm
      plantId={plantDetails.id}
      on:close={() => (isAddHealthLogModalOpen = false)}
      onSuccess={() => {
        isAddHealthLogModalOpen = false;
        handleUpdate();
      }}
    />
  </Modal>

  <ConfirmationModal
    isOpen={isDeletePlantModalOpen}
    title="Elimina Pianta"
    message="Sei sicuro di voler eliminare '{plantDetails.name}' e tutti i suoi dati? L'azione è irreversibile."
    onConfirm={handleDeletePlant}
    onCancel={() => (isDeletePlantModalOpen = false)}
    isLoading={isDeletingPlant}
  />

  <ImageViewerModal
    isOpen={isImageViewerOpen}
    images={imageViewerSource}
    onClose={() => (isImageViewerOpen = false)}
  />

  <!-- Contenitore Principale per la Revalidazione -->
  <div class="relative">
    <!-- Overlay di caricamento in background -->
    {#if isRevalidating}
      <div
        class="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-[2px] z-10 rounded-lg"
      ></div>
      <div class="absolute top-4 right-4 z-20">
        <SpinnerIcon className="w-6 h-6 text-green-600" />
      </div>
    {/if}

    <!-- Contenuto della Pagina -->
    <div class="max-w-7xl mx-auto transition-opacity" class:opacity-60={isRevalidating}>
      <!-- Breadcrumbs -->
      <div class="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <!-- Header Pianta -->
      <header class="flex flex-col md:flex-row gap-6 mb-8">
        <button on:click={openCoverImageViewer} class="flex-shrink-0 appearance-none">
          <img
            src={plantDetails.cover_image_url}
            alt="Immagine di {plantDetails.name}"
            class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
          />
        </button>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">
                {plantDetails.name}
              </h1>
              <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">{plantDetails.species}</p>
            </div>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-100"
              on:click={() => (isDeletePlantModalOpen = true)}>Elimina Pianta</Button
            >
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">
            {plantDetails.notes || 'Nessuna nota per questa pianta.'}
          </p>
        </div>
      </header>

      <!-- Sezione Tab -->
      <TabGroup>
        <svelte:fragment slot="tabs">
          {#each TABS as tabName}
            <Tab name={tabName}>{tabName}</Tab>
          {/each}
        </svelte:fragment>

        <svelte:fragment slot="content" let:activeTab>
          {#if activeTab === TABS[0]}
            <GrowthLogsTab
              plantId={plantDetails.id}
              logs={plantDetails.logs}
              on:addLog={() => (isAddLogModalOpen = true)}
              onUpdate={handleUpdate}
            />
          {:else if activeTab === TABS[1]}
            <PhotoDiaryTab logs={plantDetails.logs}  on:openImageViewer={openImageViewer} />
          {:else if activeTab === TABS[2]}
            <PlantHealthTab
              plantId={plantDetails.id}
              healthLogs={plantDetails.healthLogs}
              on:addHealthLog={() => (isAddHealthLogModalOpen = true)}
              onUpdate={handleUpdate}
            />
          {:else if activeTab === TABS[3]}
            <AiAdviceTab
              plantId={plantDetails.id}
              aiAdvices={plantDetails.aiAdvices}
              on:askAdvice={() => alert('Apri modale AskAdvice')}
              onUpdate={handleUpdate}
            />
          {/if}
        </svelte:fragment>
      </TabGroup>
    </div>
  </div>
{/if}
