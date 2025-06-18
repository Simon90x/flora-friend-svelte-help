<!--
  Contenitore che gestisce un gruppo di schede.
  Utilizza l'API Context di Svelte per la comunicazione interna con <Tab>
  e le Slot Props per esporre la scheda attiva al componente genitore.
-->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  // Lo store 'activeTab' conterrà il nome della scheda attualmente selezionata.
  const activeTab = writable('');

  // Usiamo 'setContext' per renderlo disponibile ai figli <Tab>.
  setContext('tab-group', { activeTab });
</script>

<div>
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
      <!-- Slot per i pulsanti <Tab> -->
      <slot name="tabs"></slot>
    </nav>
  </div>

  <div class="py-6">
    <!-- 
      FIX: Espone il VALORE corrente di activeTab (usando $) al genitore.
      Il genitore lo riceverà con `let:activeTab`.
    -->
    <slot name="content" activeTab={$activeTab}></slot>
  </div>
</div>