<!-- src/components/ui/EmptyState.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '@/components/ui/Button.svelte'; // Usiamo l'alias!

  export let title = '';
  export let message = '';
  export let actionText = '';
  export let actionButtonVariant = 'primary';
  
  const dispatch = createEventDispatcher();
</script>

<div class="text-center py-16 px-4 flex flex-col items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
  
  <!-- Slot per l'icona -->
  <div class="text-green-500 mb-4">
    <slot name="icon">
      <!-- Icona di default se non ne viene fornita una -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    </slot>
  </div>

  <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
  <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">{message}</p>
  
  {#if actionText}
    <Button on:click={() => dispatch('actionClick')} variant={actionButtonVariant}>
      {actionText}
    </Button>
  {/if}
</div>