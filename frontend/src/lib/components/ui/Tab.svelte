<!--
  Contenitore che gestisce un gruppo di schede.
  Utilizza l'API Context di Svelte per comunicare con i componenti Tab figli
  senza dover passare props manualmente a cascata (prop drilling).
-->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  // Lo store 'activeTab' conterrà il nome della scheda attualmente selezionata.
  // È uno store 'writable' così i componenti figli possono reagire ai suoi cambiamenti.
  const activeTab = writable('');

  // Usiamo 'setContext' per rendere lo store 'activeTab' disponibile a tutti
  // i componenti discendenti che lo richiederanno tramite 'getContext'.
  setContext('tab-group', { activeTab });
</script>

<div>
  <!-- Bordo inferiore per la barra delle schede -->
  <div class="border-b border-gray-200 dark:border-gray-700">
    <!-- 
      Slot per i pulsanti delle schede.
      Qui inseriremo i nostri componenti <Tab>.
    -->
    <nav class="-mb-px flex space-x-6" aria-label="Tabs">
      <slot name="tabs"></slot>
    </nav>
  </div>

  <!--
    Slot per il contenuto.
    Qui inseriremo il contenuto corrispondente a ciascuna scheda.
    Il componente genitore (PlantDetailView) userà la logica {#if $activeTab === ...}
    per mostrare il contenuto corretto.
  -->
  <div class="py-6">
    <slot name="content"></slot>
  </div>
</div>