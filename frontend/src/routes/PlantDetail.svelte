<script>
  import { onMount } from 'svelte';
  import { page, selectedPlant } from '../lib/stores/index.js';
  import { user } from '../lib/stores/index.js';
  import { supabase } from '../lib/services/supabaseClient.js';
  import { mockApi } from '../lib/services/mockData.js';

  import TabGroup from '../lib/components/ui/TabGroup.svelte';
  import Tab from '../lib/components/ui/Tab.svelte';
  import GrowthLogsTab from '../lib/components/detail_tabs/GrowthLogsTab.svelte';
  import PhotoDiaryTab from '../lib/components/detail_tabs/PhotoDiaryTab.svelte';
  import PlantHealthTab from '../lib/components/detail_tabs/PlantHealthTab.svelte';
  import AiAdviceTab from '../lib/components/detail_tabs/AiAdviceTab.svelte';

  let plantDetails = null;
  let isLoading = true;

  onMount(() => {
    loadPlantDetails();
  });

  async function loadPlantDetails() {
    if (!$selectedPlant?.id) return;
    isLoading = true;
    
    if ($user.id === 'demo-user') {
      // --- MOCK API CALL ---
      plantDetails = await mockApi.getPlantDetails($selectedPlant.id);
    } else {
      // --- REAL API CALLS ---
      // MOCK API BLUEPRINT: GET /rest/v1/plants?id=eq.{plantId}
      // MOCK API BLUEPRINT: GET /rest/v1/growth_logs?plant_id=eq.{plantId}
      const { data: plantData } = await supabase.from('plants').select('*').eq('id', $selectedPlant.id).single();
      const { data: logsData } = await supabase.from('growth_logs').select('*').eq('plant_id', $selectedPlant.id).order('date', { ascending: false });
      plantDetails = { ...plantData, logs: logsData || [] };
    }
    
    isLoading = false;
  }

  const TABS = ['Log Crescita', 'Diario Foto', 'Salute', 'Consigli IA'];
</script>

{#if isLoading}
  <div class="text-center p-10"><p class="text-xl text-gray-500">Caricamento dettagli pianta...</p></div>
{:else if !plantDetails}
  <div class="text-center p-10">
    <p class="text-xl text-gray-500">Nessuna pianta selezionata o trovata.</p>
    <button on:click={() => $page = 'dashboard'} class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </button>
  </div>
{:else}
  <div class="max-w-7xl mx-auto">
    <button on:click={() => $page = 'dashboard'} class="mb-4 text-sm font-medium text-green-600 hover:underline flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Dashboard
    </button>

    <header class="flex flex-col md:flex-row gap-6 mb-8">
      <img 
        src={plantDetails.cover_image_url} 
        alt="Immagine di {plantDetails.name}"
        class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg"
      >
      <div class="flex-1">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">{plantDetails.name}</h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">{plantDetails.species}</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">{plantDetails.notes || 'Nessuna nota per questa pianta.'}</p>
      </div>
    </header>

    <TabGroup let:activeTab>
      <svelte:fragment slot="tabs">
        {#each TABS as tabName}
          <Tab name={tabName}>{tabName}</Tab>
        {/each}
      </svelte:fragment>

      <svelte:fragment slot="content">
        {#if activeTab === TABS[0]}
          <GrowthLogsTab logs={plantDetails.logs} />
        {:else if activeTab === TABS[1]}
          <PhotoDiaryTab logs={plantDetails.logs} />
        {:else if activeTab === TABS[2]}
          <PlantHealthTab />
        {:else if activeTab === TABS[3]}
          <AiAdviceTab />
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
{/if}