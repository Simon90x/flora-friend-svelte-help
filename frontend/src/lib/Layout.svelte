<script>
     import '../app.css';
  // ...existing code...
</script>

<main>
  <h1>Flora Friend</h1>
  <slot />
</main>

<style>
  main {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }
</style>
