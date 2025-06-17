// src/routes/Dashboard.svelte (inizio dello script)
<script>
  // ...
  // Assicurati che i percorsi siano corretti dopo aver spostato i file!
  import PlantCard from '../components/PlantCard.svelte';
  import PlantCardSkeleton from '../components/skeletons/PlantCardSkeleton.svelte';
  import EmptyState from '../components/ui/EmptyState.svelte';
  import Button from '../components/ui/Button.svelte';
  import { PlusIcon, LeafIcon } from '../components/ui/IconComponents.svelte';

  // Rimuovi o commenta questa riga
  // /** @type {import('../../types').Plant[]} */
  export let plants = [];
  // ... resto del codice
</script>