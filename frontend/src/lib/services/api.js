// frontend/src/lib/services/api.js

import { supabase } from './supabaseClient.js';
import { user } from '../stores/index.js';
import { mockApi } from './mockData.js';
import { get } from 'svelte/store';

// --- Funzioni Helper ---

/**
 * Converte una stringa base64 in un oggetto Blob, necessario per l'upload su Supabase Storage.
 * @param {string} base64 - La stringa data URL (es. "data:image/jpeg;base64,...").
 * @returns {Blob | null}
 */
function base64ToBlob(base64) {
  if (!base64 || !base64.startsWith('data:image')) return null;
  const parts = base64.split(',');
  const contentType = parts[0].split(':')[1].split(';')[0];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Gestisce l'upload di un'immagine (base64) su Supabase Storage.
 * @param {string | null} imageBase64 - L'immagine in formato base64.
 * @returns {Promise<string|null>} L'URL pubblico dell'immagine caricata o null.
 */
async function uploadImage(imageBase64) {
  if (!imageBase64) return null;

  const currentUser = get(user);
  if (!currentUser || currentUser.id === 'demo-user') return null;

  const file = base64ToBlob(imageBase64);
  if (!file) return null;

  // Crea un percorso univoco per il file, es: "userId/1678886400000.jpg"
  const filePath = `${currentUser.id}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('plant-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('plant-images')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
}


// --- Oggetto API principale ---

export const api = {
  // --- PLANTS ---

  async getPlants() {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') return mockApi.getPlants();

    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPlantDetails(plantId) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') return mockApi.getPlantDetails(plantId);
    
    const { data, error } = await supabase
      .from('plants')
      .select('*, growth_logs(*), health_logs(*), ai_advices(*)')
      .eq('id', plantId)
      .single();

    if (error) throw error;
    
    if (data) {
        data.growth_logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        data.health_logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        data.ai_advices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return data;
  },

  async addPlant(plantData, imageBase64) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.addPlant({ ...plantData, cover_image_url: imageBase64 });
    }

    const imageUrl = await uploadImage(imageBase64);

    const { data, error } = await supabase
      .from('plants')
      .insert({
        ...plantData,
        cover_image_url: imageUrl,
        user_id: currentUser.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async deletePlant(plantId) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') return mockApi.deletePlant(plantId);
    
    const { error } = await supabase.from('plants').delete().eq('id', plantId);
    if (error) throw error;
  },

  // --- GROWTH LOGS ---

  async addGrowthLog(plantId, logData, imageBase64) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.addGrowthLog(plantId, { ...logData, photo_url: imageBase64 });
    }

    const imageUrl = await uploadImage(imageBase64);
    if (!imageUrl) throw new Error("L'immagine è obbligatoria per un log di crescita.");

    const { data, error } = await supabase
        .from('growth_logs')
        .insert({ ...logData, plant_id: plantId, photo_url: imageUrl })
        .select()
        .single();
    
    if (error) throw error;
    return data;
  },

  async deleteGrowthLog(plantId, logId) {
     const currentUser = get(user);
     if (currentUser?.id === 'demo-user') {
        return mockApi.deleteGrowthLog(plantId, logId);
     }

     const { error } = await supabase.from('growth_logs').delete().eq('id', logId);
     if (error) throw error;
  },
  
  // --- HEALTH LOGS ---

  async addHealthLog(plantId, logData, imageBase64) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.addHealthLog(plantId, { ...logData, photo_url: imageBase64 });
    }

    const imageUrl = await uploadImage(imageBase64);

    const { data, error } = await supabase
        .from('health_logs')
        .insert({ ...logData, plant_id: plantId, photo_url: imageUrl })
        .select()
        .single();
    
    if (error) throw error;
    return data;
  },

  async deleteHealthLog(plantId, logId) {
     const currentUser = get(user);
     if (currentUser?.id === 'demo-user') {
        return mockApi.deleteHealthLog(plantId, logId);
     }
     const { error } = await supabase.from('health_logs').delete().eq('id', logId);
     if (error) throw error;
  },
  
  // --- AI ADVICES ---

  async addAiAdvice(plantId, adviceData) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.addAiAdvice(plantId, adviceData);
    }
    
    const fakeAnswer = `Risposta AI simulata per: "${adviceData.question}". Per un'implementazione reale, questa logica andrebbe spostata in una Supabase Edge Function per chiamare in modo sicuro un modello LLM.`;

    const { data, error } = await supabase
        .from('ai_advices')
        .insert({
            plant_id: plantId,
            question: adviceData.question,
            image_url: adviceData.image_url,
            answer: fakeAnswer
        })
        .select()
        .single();
        
    if (error) throw error;
    return data;
  },
  // --- USER PROFILE ---

  /**
   * Aggiorna i metadati di un utente (es. nome).
   * @param {object} metadata - Oggetto con i dati da aggiornare (es. { full_name: 'Nuovo Nome' }).
   * @returns {Promise<object>} L'oggetto utente aggiornato.
   */
  async updateUserProfile(metadata) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.updateUserProfile(metadata);
    }

    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw error;
    return data.user;
  },

  /**
   * Aggiorna l'avatar di un utente. Gestisce l'upload e l'aggiornamento dei metadati.
   * @param {string} imageBase64 - La nuova immagine dell'avatar in formato base64.
   * @returns {Promise<object>} L'oggetto utente aggiornato con il nuovo URL dell'avatar.
   */
  async updateUserAvatar(imageBase64) {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
      return mockApi.updateUserProfile({ avatar_url: imageBase64 });
    }

    if (!imageBase64) throw new Error("Nessuna immagine fornita per l'avatar.");

    // Usa la nostra funzione helper per caricare l'immagine nel bucket 'plant-images'
    // In un progetto più grande, potremmo creare un bucket separato 'avatars'.
    const avatarUrl = await uploadImage(imageBase64);

    if (!avatarUrl) throw new Error("Errore durante il caricamento dell'avatar.");

    // Aggiorna i metadati dell'utente con il nuovo URL dell'avatar
    return this.updateUserProfile({ avatar_url: avatarUrl });
  },

  /**
   * Elimina l'account dell'utente.
   * IMPORTANTE: Questa è una funzione "pericolosa" e in un'app reale
   * richiederebbe una chiamata a una Edge Function per eliminare tutti i dati associati.
   * Per ora, simula solo il logout.
   */
  async deleteUserAccount() {
    const currentUser = get(user);
    if (currentUser?.id === 'demo-user') {
        return mockApi.deleteUser();
    }
    
    // In una implementazione reale, qui andrebbe chiamata una Edge Function
    // che, con privilegi di servizio, elimina i record da tutte le tabelle
    // e i file dallo storage prima di cancellare l'utente da auth.
    // Esempio: await supabase.functions.invoke('delete-user-account');
    
    // Per ora, eseguiamo solo il logout
    await supabase.auth.signOut();
  },
  async deleteAiAdvice(plantId, adviceId) {
     const currentUser = get(user);
     if (currentUser?.id === 'demo-user') {
        return mockApi.deleteAiAdvice(plantId, adviceId);
     }
     const { error } = await supabase.from('ai_advices').delete().eq('id', adviceId);
     if (error) throw error;
  }
};