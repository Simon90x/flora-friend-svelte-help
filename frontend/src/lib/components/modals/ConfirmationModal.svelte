<script>
  import Modal from './Modal.svelte';
  import Button from '../ui/Button.svelte';

  export let isOpen = false;
  export let title = 'Conferma Azione';
  export let message = 'Sei sicuro di voler procedere? Questa azione non può essere annullata.';
  export let confirmText = 'Conferma';
  export let cancelText = 'Annulla';
  export let onConfirm = () => {};
  export let onCancel = () => {};
  export let isLoading = false;
</script>

<Modal {isOpen} onClose={onCancel} size="sm">
  <div class="p-6">
    <div class="flex items-start space-x-4">
      <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <!-- Icona di avviso -->
        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100" id="modal-title">
          {title}
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
    <Button
      variant="primary"
      className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      on:click={onConfirm}
      loading={isLoading}
    >
      {confirmText}
    </Button>
    <Button
      variant="ghost"
      className="mr-3"
      on:click={onCancel}
      disabled={isLoading}
    >
      {cancelText}
    </Button>
  </div>
</Modal>