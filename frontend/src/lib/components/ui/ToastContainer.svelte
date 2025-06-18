<script>
  import { notifications } from '../../stores/notifications.js';
  import Toast from './Toast.svelte';
</script>

{#if $notifications.length > 0}
  <div
    class="fixed top-4 right-4 z-[100] space-y-3"
    aria-live="assertive"
  >
    {#each $notifications as notification (notification.id)}
      <Toast {notification} />
    {/each}
  </div>
{/if}