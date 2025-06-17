/**
 * Ridimensiona e comprime un'immagine lato client.
 * @param {File} file - Il file immagine da processare.
 * @param {{maxWidth: number, quality: number}} options - Opzioni di compressione.
 * @returns {Promise<string>} Una Promise che si risolve con l'immagine processata in formato base64 (data URL).
 */
export function resizeAndCompressImage(file, options = { maxWidth: 800, quality: 0.8 }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = options.maxWidth / img.width;
        
        // Se l'immagine è già più piccola della larghezza massima, non la ingrandiamo
        const newWidth = img.width > options.maxWidth ? options.maxWidth : img.width;
        const newHeight = img.width > options.maxWidth ? img.height * scaleFactor : img.height;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Esporta il canvas come data URL compresso in formato JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', options.quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
}