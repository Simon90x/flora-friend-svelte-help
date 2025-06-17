<script>
  import { page, selectedPlant } from '../lib/stores/index.js';

  // Importa il sistema a schede
  import TabGroup from '../lib/components/ui/TabGroup.svelte';
  import Tab from '../lib/components/ui/Tab.svelte';

  // Importa i contenuti (per ora segnaposto)
  import GrowthLogsTab from '../lib/components/detail_tabs/GrowthLogsTab.svelte';
  import PhotoDiaryTab from '../lib/components/detail_tabs/PhotoDiaryTab.svelte';
  import PlantHealthTab from '../lib/components/detail_tabs/PlantHealthTab.svelte';
  import AiAdviceTab from '../lib/components/detail_tabs/AiAdviceTab.svelte';

  // Reagisce ai cambiamenti dello store selectedPlant
  $: plant = $selectedPlant;

  // Nomi delle schede definite in una costante per pulizia
  const TABS = ['Log Crescita', 'Diario Foto', 'Salute', 'Consigli IA'];
</script>

{#if !plant}
  <!-- Stato di fallback se non c'è una pianta selezionata -->
  <div class="text-center p-10">
    <p class="text-xl text-gray-500">Nessuna pianta selezionata.</p>
    <button on:click={() => $page = 'dashboard'} class="mt-4 text-green-600 hover:underline">
      ← Torna alla Dashboard
    </button>
  </div>
{:else}
  <!-- Layout principale della pagina -->
  <div class="max-w-7xl mx-auto">
    <!-- Pulsante per tornare indietro -->
    <button on:click={() => $page = 'dashboard'} class="mb-4 text-green-600 hover:underline text-sm">
      ← Dashboard
    </button>

    <!-- 1. Intestazione della Pianta -->
    <header class="flex flex-col md:flex-row gap-6 mb-8">
      <img 
        src={plant.cover_image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'} 
        alt="Immagine di {plant.name}"
        class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg"
      >
      <div class="flex-1">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">{plant.name}</h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">{plant.species}</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">{plant.notes || 'Nessuna nota per questa pianta.'}</p>
      </div>
      <!-- Placeholder per i pulsanti di azione -->
      <div class="flex-shrink-0">
          <p class="text-xs text-gray-400">[Pulsanti Azione Qui]</p>
      </div>
    </header>

    <!-- 2. Sistema a Schede -->
    <TabGroup let:activeTab>
      <!-- Definiamo i pulsanti delle schede nello slot 'tabs' -->
      <svelte:fragment slot="tabs">
        {#each TABS as tabName}
          <Tab name={tabName}>{tabName}</Tab>
        {/each}
      </svelte:fragment>

      <!-- Definiamo il contenuto nello slot 'content' -->
      <svelte:fragment slot="content">
        {#if activeTab === TABS[0]}
          <GrowthLogsTab />
        {:else if activeTab === TABS[1]}
          <PhotoDiaryTab />
        {:else if activeTab === TABS[2]}
          <PlantHealthTab />
        {:else if activeTab === TABS[3]}
          <AiAdviceTab />
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
{/if}