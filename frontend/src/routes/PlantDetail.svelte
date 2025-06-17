<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/services/supabaseClient.js';
  import { link, pop } from 'svelte-spa-router';

  // Riceve i parametri dalla rotta dinamica '/plant/:id'
  export let params = {};
  
  let plant = null;
  let isLoading = true;
  let error = '';
  
  // Importa il sistema a schede
  import TabGroup from '../lib/components/ui/TabGroup.svelte';
  import Tab from '../lib/components/ui/Tab.svelte';

  // Importa i veri contenuti delle schede (che andranno creati)
  import GrowthLogsTab from '../lib/components/detail_tabs/GrowthLogsTab.svelte';
  import PhotoDiaryTab from '../lib/components/detail_tabs/PhotoDiaryTab.svelte';
  import PlantHealthTab from '../lib/components/detail_tabs/PlantHealthTab.svelte';
  import AiAdviceTab from '../lib/components/detail_tabs/AiAdviceTab.svelte';

  onMount(async () => {
    const plantId = params.id;
    if (!plantId) {
      error = 'ID della pianta non valido.';
      isLoading = false;
      return;
    }
    
    // MOCK API: GET /rest/v1/plants?id=eq.{plantId}&select=*
    const { data, error: fetchError } = await supabase
      .from('plants')
      .select('*')
      .eq('id', plantId)
      .single(); // .single() restituisce un oggetto invece di un array
    
    if (fetchError) {
      error = `Impossibile trovare la pianta. ${fetchError.message}`;
    } else {
      plant = data;
    }
    isLoading = false;
  });

  const TABS = ['Log Crescita', 'Diario Foto', 'Salute', 'Consigli IA'];
</script>

{#if isLoading}
  <p>Caricamento dettagli pianta...</p> <!-- Sostituire con uno scheletro UI -->
{:else if error}
  <div class="text-center p-10">
    <p class="text-xl text-red-500">{error}</p>
    <a href="/dashboard" use:link class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </a>
  </div>
{:else if !plant}
  <div class="text-center p-10">
    <p class="text-xl text-gray-500">Nessuna pianta trovata.</p>
    <a href="/dashboard" use:link class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </a>
  </div>
{:else}
  <div class="max-w-7xl mx-auto">
    <button on:click={() => pop()} class="mb-4 text-green-600 hover:underline text-sm flex items-center gap-1">
      ← Dashboard
    </button>

    <header class="flex flex-col md:flex-row gap-6 mb-8">
      <img 
        src={plant.cover_image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'} 
        alt="Immagine di {plant.name}"
        class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg"
        loading="lazy"
      >
      <div class="flex-1">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">{plant.name}</h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">{plant.species}</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">{plant.notes || 'Nessuna nota per questa pianta.'}</p>
      </div>
      <!-- TODO: Implementare pulsanti di azione (es. elimina pianta) -->
    </header>

    <TabGroup let:activeTab>
      <svelte:fragment slot="tabs">
        {#each TABS as tabName}
          <Tab name={tabName}>{tabName}</Tab>
        {/each}
      </svelte:fragment>

      <svelte:fragment slot="content">
        {#if activeTab === TABS[0]}
          <!-- MOCK API: GET /rest/v1/growth_logs?plant_id=eq.{plant.id}&select=* -->
          <GrowthLogsTab plantId={plant.id} />
        {:else if activeTab === TABS[1]}
          <!-- Derivato dai dati di growth_logs -->
          <PhotoDiaryTab plantId={plant.id} />
        {:else if activeTab === TABS[2]}
          <!-- MOCK API: GET /rest/v1/health_logs?plant_id=eq.{plant.id}&select=* -->
          <PlantHealthTab plantId={plant.id} />
        {:else if activeTab === TABS[3]}
          <!-- MOCK API: GET /rest/v1/ai_advices?plant_id=eq.{plant.id}&select=* -->
          <AiAdviceTab plantId={plant.id} />
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
{/if}