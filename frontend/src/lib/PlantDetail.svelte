<script>
  import { page, selectedPlant } from './navigation';
     import '../app.css';
  //import { Button } from '@skeletonlabs/skeleton';
  let plant;
  $: selectedPlant.subscribe(p => plant = p);

  function backToDashboard() {
    page.set('dashboard');
    selectedPlant.set(null);
  }
</script>

{#if plant}
  <h2>{plant.name} ({plant.species})</h2>
  <img src={plant.cover_image_url} alt={plant.name} style="max-width: 300px;" />
  <p>{plant.notes}</p>
   <button class="btn" on:click={backToDashboard}>Dashboard</button>
  <!-- Tabs log crescita, salute, AI advice: placeholder -->
  <p>Sezioni log crescita, salute, AI advice (da implementare)</p>
{:else}
  <p>Nessuna pianta selezionata.</p>
{/if}
