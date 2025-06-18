<script>
  import { link } from 'svelte-spa-router';

  /**
   * @type {Array<{label: string, href?: string}>}
   * Esempio:
   * [
   *   { label: 'Dashboard', href: '/dashboard' },
   *   { label: 'La mia Pianta', href: '/plant/123' }, // Opzionale, l'ultimo di solito non ha href
   * ]
   */
  export let items = [];
</script>

<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
  {#each items as item, i}
    {#if i > 0}
      <!-- Separatore -->
      <svg class="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
      </svg>
    {/if}

    {#if i === items.length - 1}
      <!-- Ultimo elemento (pagina corrente), non è un link -->
      <span class="font-medium text-gray-700 dark:text-gray-200 truncate" aria-current="page">
        {item.label}
      </span>
    {:else}
      <!-- Elementi intermedi, sono link -->
      <a
        href={item.href}
        use:link
        class="hover:text-green-600 dark:hover:text-green-400 transition-colors"
      >
        {item.label}
      </a>
    {/if}
  {/each}
</nav>