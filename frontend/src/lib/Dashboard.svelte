<script>
  import { user } from './stores';
  import { onMount } from 'svelte';
  import { fetchTable } from './supabaseClient';
  import { selectedPlant, page } from './navigation';
  import '../app.css';
  let plants = [];
  let loading = true;
  let error = '';

  async function loadPlants() {
    loading = true;
    error = '';
    try {
      plants = await fetchTable('plants');
    } catch (e) {
      error = e.message;
    }
    loading = false;
  }

  function addPlant() {
    // Apri modale (placeholder)
    alert('Apertura modale aggiunta pianta (da implementare)');
  }

  function openPlantDetail(plant) {
    selectedPlant.set(plant);
    page.set('plantDetail');
  }

  function handleLogout() {
    user.set(null);
    window.location.href = '/';
  }

  onMount(loadPlants);
</script>

<main>
  <h1>Dashboard</h1>
  {#if $user}
    <p>Benvenuto, {$user.name}</p>
    <p>Email: {$user.email}</p>
    <!-- ...altri flussi base specifici della dashboard... -->
  {:else}
    <p>Accesso in modalità demo attivo</p>
  {/if}
  <button type="button" on:click={handleLogout}>Logout</button>

  <h2>Le tue piante</h2>
  {#if loading}
    <p>Caricamento...</p>
  {:else if error}
    <p style="color:red">{error}</p>
  {:else if plants.length === 0}
    <p>
      Nessuna pianta trovata. <button class="btn" on:click={addPlant}>Aggiungi la prima pianta</button
      >
    </p>
  {:else}
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      {#each plants as plant}
        <button
          type="button"
          class="card"
          style="width: 200px; cursor: pointer; padding: 0; border: none; background: none;"
          on:click={() => openPlantDetail(plant)}
          aria-label="Apri dettagli pianta {plant.name}"
        >
          <img
            src={plant.cover_image_url}
            alt={plant.name}
            style="height: 120px; object-fit: cover; width: 100%; border-radius: 8px 8px 0 0;"
          />
          <div class="card-content" style="padding: 1rem;">
            <h3>{plant.name}</h3>
            <p>{plant.species}</p>
          </div>
        </button>
      {/each}
    </div>
    <button class="btn" on:click={addPlant} style="margin-top: 1rem;">Aggiungi nuova pianta</button>
  {/if}
</main>
