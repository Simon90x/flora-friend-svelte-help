<script>
  // ... (tutte le importazioni e la logica esistente rimangono invariate)
  import { onMount } from 'svelte';
  import { user, selectedPlant } from '../lib/stores/index.js';
  import { mockApi } from '../lib/services/mockData.js';
  import { link, push } from 'svelte-spa-router';
  
  import TabGroup from '../lib/components/ui/TabGroup.svelte';
  import Tab from '../lib/components/ui/Tab.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import Modal from '../lib/components/modals/Modal.svelte';
  import ConfirmationModal from '../lib/components/modals/ConfirmationModal.svelte';

  import GrowthLogsTab from '../lib/components/detail_tabs/GrowthLogsTab.svelte';
  import PhotoDiaryTab from '../lib/components/detail_tabs/PhotoDiaryTab.svelte';
  import PlantHealthTab from '../lib/components/detail_tabs/PlantHealthTab.svelte';
  import AiAdviceTab from '../lib/components/detail_tabs/AiAdviceTab.svelte';
  
  import AddLogForm from '../lib/components/forms/AddLogForm.svelte';
  import AddHealthLogForm from '../lib/components/forms/AddHealthLogForm.svelte'; // Aggiungi import

  export let params = {};
  
  let plantDetails = null;
  let isLoading = true;
  let error = '';

  let isAddLogModalOpen = false;
  let isDeletePlantModalOpen = false;
  let isDeletingPlant = false;
  let isAddHealthLogModalOpen = false;

  async function loadPlantDetails(plantId) {
    if (!plantId) {
        error = "ID della pianta non fornito.";
        isLoading = false;
        return;
    };
    isLoading = true;
    error = '';
    
    try {
        const data = await mockApi.getPlantDetails(plantId);
        if (data) {
            plantDetails = data;
            selectedPlant.set(plantDetails);
        } else {
            error = `Nessuna pianta trovata con ID: ${plantId}`;
            plantDetails = null;
        }
    } catch (e) {
        console.error("Errore nel caricamento dei dettagli della pianta:", e);
        error = "Si è verificato un errore durante il caricamento dei dati.";
        plantDetails = null;
    } finally {
        isLoading = false;
    }
  }
  
  $: if (params.id) {
    loadPlantDetails(params.id);
  }

  async function handleDeletePlant() {
    isDeletingPlant = true;
    await mockApi.deletePlant(plantDetails.id);
    isDeletingPlant = false;
    isDeletePlantModalOpen = false;
    push('/dashboard');
  }

  const TABS = ['Log Crescita', 'Diario Foto', 'Salute', 'Consigli IA'];
</script>

{#if isLoading}
  <div class="text-center p-10"><p class="text-xl text-gray-500">Caricamento dettagli pianta...</p></div>
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
    <p class="text-xl text-gray-500">Nessuna pianta trovata con questo ID.</p>
    <a href="/dashboard" use:link class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </a>
  </div>
{:else}
  <!-- ... (Modali rimangono invariate) ... -->
  <Modal isOpen={isAddLogModalOpen} onClose={() => isAddHealthLogModalOpen = false} size="lg">
    <AddHealthLogForm
      plantId={plantDetails.id}
      on:close={() => isAddHealthLogModalOpen = false}
      onSuccess={() => {
        isAddHealthLogModalOpen = false;
        loadPlantDetails(plantDetails.id);
      }}
    />
  </Modal>
  <ConfirmationModal
    isOpen={isDeletePlantModalOpen}
    title="Elimina Pianta"
    message="Sei sicuro di voler eliminare '{plantDetails.name}' e tutti i suoi dati? L'azione è irreversibile."
    onConfirm={handleDeletePlant}
    onCancel={() => isDeletePlantModalOpen = false}
    isLoading={isDeletingPlant}
  />
  
  <div class="max-w-7xl mx-auto">
    <a href="/dashboard" use:link class="mb-4 text-sm font-medium text-green-600 hover:underline flex items-center">
        <!-- ... (SVG icona freccia) ... -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Dashboard
    </a>

    <!-- ... (Header rimane invariato) ... -->
    <header class="flex flex-col md:flex-row gap-6 mb-8">
        <img src={plantDetails.cover_image_url} alt="Immagine di {plantDetails.name}" class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg">
        <div class="flex-1">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">{plantDetails.name}</h1>
                    <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">{plantDetails.species}</p>
                </div>
                <Button variant="ghost" className="text-red-600 hover:bg-red-100" on:click={() => isDeletePlantModalOpen = true}>Elimina Pianta</Button>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">{plantDetails.notes || 'Nessuna nota per questa pianta.'}</p>
        </div>
    </header>

    <!-- FIX: Aggiunta la direttiva `let:activeTab` per ricevere la variabile dallo slot -->
    <TabGroup>
      <svelte:fragment slot="tabs">
        {#each TABS as tabName}
          <Tab name={tabName}>{tabName}</Tab>
        {/each}
      </svelte:fragment>


      <svelte:fragment slot="content" let:activeTab>
        {#if activeTab === TABS[0]}
          <!-- ... (GrowthLogsTab) ... -->
        {:else if activeTab === TABS[1]}
          <PhotoDiaryTab logs={plantDetails.logs} />
        {:else if activeTab === TABS[2]}
          <PlantHealthTab 
            plantId={plantDetails.id}
            healthLogs={plantDetails.healthLogs}
            on:addHealthLog={() => isAddHealthLogModalOpen = true}
            onUpdate={() => loadPlantDetails(plantDetails.id)}
          />
        {:else if activeTab === TABS[3]}
          <AiAdviceTab />
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
{/if}