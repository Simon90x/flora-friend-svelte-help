<script>
  import { page, selectedPlant } from './navigation';
   import '../app.css';
  function goToProfile() {
    page.set('profile');
  }
  function goToDashboard() {
    page.set('dashboard');
  }
</script>

<nav>
  <button class="btn" on:click={goToDashboard}>Dashboard</button>
  <button class="btn" on:click={goToProfile}>Profilo</button>
</nav>
