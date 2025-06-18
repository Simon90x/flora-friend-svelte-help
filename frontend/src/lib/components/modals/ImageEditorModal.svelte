<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import Button from '../ui/Button.svelte';

  export let isOpen = false;
  export let imageBase64 = ''; // Immagine da modificare

  const dispatch = createEventDispatcher();
  
  let canvasElement;
  let rotation = 0;

  $: if (isOpen && imageBase64) {
    rotation = 0;
    drawImage();
  }

  function drawImage() {
    if (!canvasElement || !imageBase64) return;
    const ctx = canvasElement.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const canvas = ctx.canvas;
      const angle = rotation * Math.PI / 180;
      
      // Calcola le dimensioni del canvas per contenere l'immagine ruotata
      const sin = Math.abs(Math.sin(angle));
      const cos = Math.abs(Math.cos(angle));
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      // Resetta le trasformazioni per il prossimo disegno
      ctx.rotate(-angle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    };
    img.src = imageBase64;
  }

  function rotate() {
    rotation = (rotation + 90) % 360;
    drawImage();
  }

  function handleSave() {
    if (!canvasElement) return;
    const newBase64 = canvasElement.toDataURL('image/jpeg', 0.9);
    dispatch('save', newBase64);
    dispatch('close');
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<Modal isOpen={isOpen} onClose={handleClose} size="md">
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Modifica Immagine</h2>
    
    <div class="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[300px]">
      <canvas bind:this={canvasElement} class="max-w-full max-h-[400px]"></canvas>
    </div>

    <div class="flex justify-center mt-4">
      <Button on:click={rotate}>
        Ruota di 90°
      </Button>
    </div>
  </div>
  <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
    <Button on:click={handleSave}>Salva Modifiche</Button>
    <Button variant="ghost" on:click={handleClose} className="mr-3">Annulla</Button>
  </div>
</Modal>