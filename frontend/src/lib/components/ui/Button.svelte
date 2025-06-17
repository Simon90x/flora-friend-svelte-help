<!-- src/components/ui/Button.svelte -->
<script>
  export let variant = 'primary'; // 'primary', 'secondary', 'ghost'
  export let size = 'md'; // 'sm', 'md', 'lg'
  export let className = '';
  export let disabled = false;

  // Classi di base per tutti i pulsanti
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classi specifiche per ogni variante di stile
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    secondary: 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/80 focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
  };

  // Classi per le diverse dimensioni
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
</script>

<button
  {disabled}
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
  on:click
>
  <!-- Slot per un'icona a sinistra del testo -->
  {#if $$slots.leftIcon}
    <span class="mr-2 -ml-1 h-5 w-5">
      <slot name="leftIcon" />
    </span>
  {/if}
  
  <!-- Slot per il testo principale del pulsante -->
  <slot />
</button>