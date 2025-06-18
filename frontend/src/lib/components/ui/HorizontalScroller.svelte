<script>
  // Un semplice wrapper per creare un contenitore a scorrimento orizzontale
  // con uno stile personalizzato per la scrollbar.
</script>

<div class="horizontal-scroller -mx-4 px-4 py-2">
  <div class="flex items-center space-x-4">
    <slot></slot>
  </div>
</div>

<style>
  .horizontal-scroller {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #9ca3af #f3f4f6;
  }
  .horizontal-scroller::-webkit-scrollbar {
    height: 8px;
  }
  .horizontal-scroller::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }
  .horizontal-scroller::-webkit-scrollbar-thumb {
    background-color: #9ca3af;
    border-radius: 4px;
    border: 2px solid #f3f4f6;
  }
  .dark .horizontal-scroller {
    scrollbar-color: #4b5563 #1f2937;
  }
  .dark .horizontal-scroller::-webkit-scrollbar-track {
    background: #1f2937;
  }
  .dark .horizontal-scroller::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    border-color: #1f2937;
  }
</style>