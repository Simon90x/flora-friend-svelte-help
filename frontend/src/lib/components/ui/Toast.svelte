<script>
  import { toast } from '../../stores/notifications.js';
  import { fly } from 'svelte/transition';

  export let notification;

  // Definiamo stili e icone basate sul tipo di notifica
  const styles = {
    info: {
      bg: 'bg-blue-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    },
    success: {
      bg: 'bg-green-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    },
    error: {
      bg: 'bg-red-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    },
  };

  const currentStyle = styles[notification.type] || styles.info;
</script>

<div
  class="flex items-center text-white p-4 rounded-lg shadow-2xl {currentStyle.bg} min-w-[320px] max-w-md"
  role="alert"
  transition:fly={{ x: 300, duration: 300 }}
>
  <div class="flex-shrink-0">
    {@html currentStyle.icon}
  </div>
  <div class="flex-1 ml-3 font-medium">
    {notification.message}
  </div>
  <button
    on:click={() => toast.remove(notification.id)}
    class="ml-4 -mr-1 flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
    aria-label="Chiudi notifica"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>