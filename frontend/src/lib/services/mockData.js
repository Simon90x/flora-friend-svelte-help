// frontend/src/lib/services/mockData.js

/**
 * Servizio per gestire i dati della modalità demo in memoria.
 * Simula un backend senza effettuare chiamate di rete.
 * Questo permette un'esperienza utente completa e interattiva.
 */
import { writable } from 'svelte/store';

// Dati iniziali fittizi
const initialData = {
  plants: [
    { 
      id: 'demo-plant-1',
      user_id: 'demo-user',
      name: 'Monstera di Mario',
      species: 'Monstera deliciosa',
      date_added: '2023-05-15',
      notes: 'Acquistata dal vivaio locale. Ha bisogno di molta luce indiretta.',
      cover_image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80',
    },
    { 
      id: 'demo-plant-2',
      user_id: 'demo-user',
      name: 'Felce',
      species: 'Nephrolepis exaltata',
      date_added: '2023-09-01',
      notes: 'Ama l\'umidità. La tengo in bagno.',
      cover_image_url: 'https://images.unsplash.com/photo-1605651203923-958b4f18474a?w=500&q=80',
    }
  ],
  growthLogs: {
    'demo-plant-1': [
      { id: 'log1', plant_id: 'demo-plant-1', date: '2023-10-22', notes: 'Spuntata una nuova foglia!', photo_url: 'https://images.unsplash.com/photo-1555511837-727a85f40363?w=500&q=80', height_cm: 35 },
      { id: 'log2', plant_id: 'demo-plant-1', date: '2023-08-10', notes: 'Rinvasata in un contenitore più grande.', photo_url: 'https://images.unsplash.com/photo-1591324741366-c956b107b3b3?w=500&q=80', height_cm: 30 },
    ],
    'demo-plant-2': [
       { id: 'log3', plant_id: 'demo-plant-2', date: '2023-11-05', notes: 'Le foglie sembrano molto rigogliose.', photo_url: 'https://images.unsplash.com/photo-1587843400582-c55985d8931b?w=500&q=80', height_cm: 25 },
    ]
  },
  // Aggiungere qui healthLogs e aiAdvices se necessario
};

// Creiamo uno store writable con i dati iniziali per renderli reattivi
const demoDataStore = writable(initialData);

// Funzioni che simulano le chiamate API
export const mockApi = {
  getPlants: () => {
    return new Promise(resolve => {
        demoDataStore.subscribe(data => resolve(data.plants))();
    });
  },

  getPlantDetails: (plantId) => {
    return new Promise(resolve => {
        demoDataStore.subscribe(data => {
            const plant = data.plants.find(p => p.id === plantId);
            const logs = data.growthLogs[plantId] || [];
            resolve({ ...plant, logs });
        })();
    });
  },

  addPlant: (plantData) => {
    return new Promise(resolve => {
        const newPlant = {
            ...plantData,
            id: `demo-plant-${Date.now()}`,
            user_id: 'demo-user',
        };
        demoDataStore.update(data => {
            data.plants = [newPlant, ...data.plants];
            return data;
        });
        resolve(newPlant);
    });
  },
  
  addGrowthLog: (plantId, logData) => {
    return new Promise(resolve => {
      const newLog = {
        ...logData,
        id: `log-${Date.now()}`,
        plant_id: plantId,
      };
      demoDataStore.update(data => {
        if (!data.growthLogs[plantId]) {
          data.growthLogs[plantId] = [];
        }
        data.growthLogs[plantId] = [newLog, ...data.growthLogs[plantId]];
        return data;
      });
      resolve(newLog);
    });
  }
};
