// frontend/src/lib/services/imageClassifier.js

// Importiamo la funzione per convertire base64 in Blob che avevamo già
import { base64ToBlob } from '../utils/imageUtils.js'; // Assumiamo che la funzione sia qui

const apiKey = import.meta.env.VITE_PLANTNET_API_KEY;

/**
 * Chiama l'API di Pl@ntNet per identificare la specie da un'immagine.
 * @param {string} imageBase64 - L'immagine in formato base64.
 * @returns {Promise<object|null>} Un oggetto contenente i suggerimenti.
 */
export async function suggestSpeciesFromImage(imageBase64) {
  if (!apiKey) {
    throw new Error("La chiave API per Pl@ntNet non è configurata nel file .env. Riavvia il server.");
  }
  if (!imageBase64) return null;

  // L'endpoint di Pl@ntNet
  const project = 'all'; // 'all' per un'identificazione generica
  const endpoint = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`;

  // 1. Convertiamo il nostro base64 in un file Blob
  const imageBlob = base64ToBlob(imageBase64);
  if (!imageBlob) {
    throw new Error("Impossibile processare l'immagine.");
  }
  
  // 2. Creiamo un oggetto FormData per inviare il file
  const formData = new FormData();
  // L'API si aspetta che ogni immagine sia associata a un "organo" della pianta.
  // Per un'immagine generica, 'auto' è una buona scelta.
  formData.append('organs', 'auto');
  // Aggiungiamo l'immagine come file. Il terzo parametro ('plant.jpg') è il nome del file.
  formData.append('images', imageBlob, 'plant.jpg');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData, // Non usiamo più JSON, ma l'oggetto FormData
      // NOTA: Non impostare l'header 'Content-Type'. Il browser lo farà
      // automaticamente e correttamente per multipart/form-data, includendo il boundary.
    });

    if (!response.ok) {
      console.log("Errore nella risposta dell'API Pl@ntNet:", formData);
      const errorText = await response.text();
      throw new Error(`Errore dall'API Pl@ntNet (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("Risposta da Pl@ntNet API:", data);
    return data;

  } catch (error) {
    console.error("Impossibile contattare l'API di Pl@ntNet:", error);
    throw error;
  }
}