<script>
  import { getContext } from 'svelte';

  export let name;

  // Richiediamo lo store 'activeTab' che il nostro 'TabGroup' ha fornito.
  const { activeTab } = getContext('tab-group');

  // Quando la scheda viene cliccata, aggiorniamo il valore dello store condiviso.
  function selectTab() {
    activeTab.set(name);
  }

  // Imposta questa scheda come attiva all'inizio se è la prima ad essere renderizzata
  // e nessun'altra ha già impostato un valore.
  if ($activeTab === '') {
    $activeTab = name;
  }
</script>

<button
type="button"
  on:click={selectTab}
  class="whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
  class:border-green-500={$activeTab === name}
  class:text-green-600={$activeTab === name}
  class:dark:text-green-400={$activeTab === name}
  class:border-transparent={!($activeTab === name)}
  class:text-gray-500={!($activeTab === name)}
  class:hover:text-gray-700={!($activeTab === name)}
  class:hover:border-gray-300={!($activeTab === name)}
  class:dark:text-gray-400={!($activeTab === name)}
  class:dark:hover:text-gray-300={!($activeTab === name)}
>
  <slot></slot>
</button>