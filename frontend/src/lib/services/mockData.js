import { writable } from 'svelte/store';
import { user } from '../stores/index.js';

const getInitialData = () => ({
  plants: [
    { 
      id: 'demo-plant-1',
      user_id: 'demo-user',
      name: 'Pomodoro "Cuore di Bue"',
      species: 'Solanum lycopersicum',
      date_added: '2024-04-10',
      notes: 'Piantato in vaso grande sul balcone. Esposizione sud-ovest.',
      cover_image_url: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=500&q=80',
    },
    { 
      id: 'demo-plant-2',
      user_id: 'demo-user',
      name: 'Gelsomino Rampicante',
      species: 'Trachelospermum jasminoides',
      date_added: '2023-09-01',
      notes: 'Regalo di compleanno. Posizionato vicino al muro per farlo arrampicare. Profumo incredibile!',
      cover_image_url: 'https://images.unsplash.com/photo-1622383437207-210a424859a7?w=500&q=80',
    },
    {
      id: 'demo-plant-3',
      user_id: 'demo-user',
      name: 'Rosmarino dell\'orto',
      species: 'Salvia rosmarinus',
      date_added: '2023-03-20',
      notes: 'Molto resistente, richiede poca acqua. Ottimo per cucinare.',
      cover_image_url: 'https://images.unsplash.com/photo-1594212290833-39a9c4f34615?w=500&q=80',
    },
    {
      id: 'demo-plant-4',
      user_id: 'demo-user',
      name: 'Lavanda Provenzale',
      species: 'Lavandula angustifolia',
      date_added: '2024-05-01',
      notes: 'Ama il sole diretto. Usata per profumare la biancheria.',
      cover_image_url: 'https://images.unsplash.com/photo-1604803385841-3b7627473775?w=500&q=80',
    },
    {
      id: 'demo-plant-5',
      user_id: 'demo-user',
      name: 'Dipladenia Rosa',
      species: 'Mandevilla sanderi',
      date_added: '2024-06-15',
      notes: 'Fioritura spettacolare. Teme il gelo, da ritirare in inverno.',
      cover_image_url: 'https://images.unsplash.com/photo-1689364434257-19515a089182?w=500&q=80',
    }
  ],
  // ... (il resto del file, growthLogs, healthLogs, etc. rimane identico a prima)
  growthLogs: {
    'demo-plant-1': [ // Pomodoro
      { id: 'log-p1-1', plant_id: 'demo-plant-1', date: '2024-06-20', notes: 'Primi pomodorini verdi stanno crescendo!', photo_url: 'https://images.unsplash.com/photo-1663310549878-eef93874df6f?q=80&w=687', height_cm: 60 },
      { id: 'log-p1-2', plant_id: 'demo-plant-1', date: '2024-06-05', notes: 'Fioritura abbondante, colore giallo intenso.', photo_url: 'https://images.unsplash.com/photo-1567481599210-9b707e697c42?q=80&w=1170', height_cm: 45 },
      { id: 'log-p1-3', plant_id: 'demo-plant-1', date: '2024-05-15', notes: 'Aggiunto tutore per sostenere la crescita.', photo_url: 'https://images.unsplash.com/photo-1744835896651-93493e7d2ffc?q=80&w=1170', height_cm: 30 },
      { id: 'log-p1-4', plant_id: 'demo-plant-1', date: '2024-04-25', notes: 'Le prime foglie vere sono spuntate.', photo_url: 'https://images.unsplash.com/photo-1662027883502-0695c0b46f60?q=80&w=791', height_cm: 10 },
    ],
    'demo-plant-2': [ // Gelsomino
      { id: 'log-p2-1', plant_id: 'demo-plant-2', date: '2024-06-10', notes: 'La fioritura è al suo apice, il profumo si sente in tutta la casa.', photo_url: 'https://images.unsplash.com/photo-1559381614-704e38462033?w=500&q=80', height_cm: 150 },
      { id: 'log-p2-2', plant_id: 'demo-plant-2', date: '2024-05-20', notes: 'Nuovi getti stanno crescendo vigorosamente.', photo_url: 'https://images.unsplash.com/photo-1655930219669-1a4a47511b9c?w=500&q=80', height_cm: 120 },
    ],
    'demo-plant-3': [ // Rosmarino
      { id: 'log-p3-1', plant_id: 'demo-plant-3', date: '2024-04-15', notes: 'Potatura leggera per favorire una crescita compatta.', photo_url: 'https://images.unsplash.com/photo-1618619410756-12150b69a104?w=500&q=80', height_cm: 40 },
      { id: 'log-p3-2', plant_id: 'demo-plant-3', date: '2023-10-05', notes: 'Superato bene l\'estate calda. Molto aromatico.', photo_url: 'https://images.unsplash.com/photo-1519967628854-a42e51600b57?w=500&q=80', height_cm: 35 },
    ],
    'demo-plant-4': [ // Lavanda
      { id: 'log-p4-1', plant_id: 'demo-plant-4', date: '2024-06-25', notes: 'Le spighe sono quasi pronte per essere raccolte.', photo_url: 'https://images.unsplash.com/photo-1597844439180-8b17354350da?w=500&q=80', height_cm: 50 },
      { id: 'log-p4-2', plant_id: 'demo-plant-4', date: '2024-06-01', notes: 'I fiori iniziano a colorarsi di viola.', photo_url: 'https://images.unsplash.com/photo-1567057419541-38b8f2972b22?w=500&q=80', height_cm: 40 },
      { id: 'log-p4-3', plant_id: 'demo-plant-4', date: '2024-05-10', notes: 'Piantata in piena terra. Sembra essersi adattata bene.', photo_url: 'https://images.unsplash.com/photo-1597844437257-4b47e5a4a5a1?w=500&q=80', height_cm: 25 },
    ],
    'demo-plant-5': [ // Dipladenia
      { id: 'log-p5-1', plant_id: 'demo-plant-5', date: '2024-07-01', notes: 'Continua a produrre fiori a forma di trombetta senza sosta.', photo_url: 'https://images.unsplash.com/photo-1623856180373-35615822365a?w=500&q=80', height_cm: 55 },
      { id: 'log-p5-2', plant_id: 'demo-plant-5', date: '2024-06-20', notes: 'Prima fioritura dopo l\'acquisto. Colore rosa vivace.', photo_url: 'https://images.unsplash.com/photo-1657492928594-569a1955c235?w=500&q=80', height_cm: 50 },
    ]
  },
  healthLogs: {
    'demo-plant-1': [ // Pomodoro
      { id: 'health-p1-1', plant_id: 'demo-plant-1', date: '2024-06-18', type: 'Peste', severity: 'Bassa', notes: 'Notato qualche afide sulle foglie più basse. Trattato con sapone di Marsiglia.', photo_url: 'https://images.unsplash.com/photo-1615155699268-236b579f?w=500&q=80' },
      { id: 'health-p1-2', plant_id: 'demo-plant-1', date: '2024-07-02', type: 'Miglioramento', severity: 'Bassa', notes: 'Gli afidi sembrano spariti dopo il trattamento. Le foglie sono tornate sane.' },
    ],
    'demo-plant-2': [ // Gelsomino
      { id: 'health-p2-1', plant_id: 'demo-plant-2', date: '2024-05-05', type: 'Carenza Nutrienti', severity: 'Media', notes: 'Foglie un po\' ingiallite. Aggiunto concime per piante fiorite.', photo_url: 'https://images.unsplash.com/photo-1629823695289-3b4a28a3a03c?w=500&q=80' }
    ],
    'demo-plant-3': [ // Rosmarino
        { id: 'health-p3-1', plant_id: 'demo-plant-3', date: '2024-05-22', type: 'Miglioramento', severity: 'Bassa', notes: 'Nessun problema da segnalare, pianta molto in salute e robusta.' }
    ],
    'demo-plant-4': [], // Lavanda, nessun problema
    'demo-plant-5': [ // Dipladenia
      { id: 'health-p5-1', plant_id: 'demo-plant-5', date: '2024-06-28', type: 'Irrigazione/Luce', severity: 'Bassa', notes: 'Le foglie più basse tendono a ingiallire. Forse troppa acqua. Riduco le annaffiature.' },
    ]
  },
  aiAdvices: {
    'demo-plant-1': [
      { id: 'ai1', plant_id: 'demo-plant-1', date: '2024-06-19', question: 'Come posso combattere gli afidi in modo naturale?', image_url: 'https://images.unsplash.com/photo-1615155699268-236b579f?w=500&q=80', answer: 'Un ottimo rimedio naturale contro gli afidi è una soluzione di acqua e sapone di Marsiglia. Sciogli un cucchiaio di sapone in scaglie in un litro d\'acqua tiepida, lascia raffreddare e spruzza sulla pianta, specialmente sotto le foglie. Ripeti ogni 4-5 giorni.' }
    ]
  }
});

const demoDataStore = writable(getInitialData());

export const mockApi = {
  getPlants: () => new Promise(resolve => {
    demoDataStore.subscribe(data => resolve(data.plants))();
  }),
  getPlantDetails: (plantId) => new Promise(resolve => {
    demoDataStore.subscribe(data => {
      const plant = data.plants.find(p => p.id === plantId);
      if (!plant) {
        resolve(null);
        return;
      }
      const logs = data.growthLogs[plantId] || [];
      const health = data.healthLogs[plantId] || [];
      const advices = data.aiAdvices[plantId] || [];
      resolve({ ...plant, logs, healthLogs: health, aiAdvices: advices });
    })();
  }),
  addPlant: (plantData) => new Promise(resolve => {
    const newPlant = { ...plantData, id: `demo-plant-${Date.now()}`, user_id: 'demo-user' };
    demoDataStore.update(data => {
      data.plants.unshift(newPlant);
      return data;
    });
    resolve(newPlant);
  }),
  deletePlant: (plantId) => new Promise(resolve => {
    demoDataStore.update(data => {
        data.plants = data.plants.filter(p => p.id !== plantId);
        delete data.growthLogs[plantId];
        delete data.healthLogs[plantId];
        delete data.aiAdvices[plantId];
        return data;
    });
    resolve({ success: true });
  }),
  addGrowthLog: (plantId, logData) => new Promise(resolve => {
    const newLog = { ...logData, id: `log-${Date.now()}`, plant_id: plantId };
    demoDataStore.update(data => {
      if (!data.growthLogs[plantId]) data.growthLogs[plantId] = [];
      data.growthLogs[plantId] = [newLog, ...data.growthLogs[plantId]].sort((a,b) => new Date(b.date) - new Date(a.date));
      return data;
    });
    resolve(newLog);
  }),
  deleteGrowthLog: (plantId, logId) => new Promise(resolve => {
    demoDataStore.update(data => {
        if(data.growthLogs[plantId]) {
            data.growthLogs[plantId] = data.growthLogs[plantId].filter(log => log.id !== logId);
        }
        return data;
    });
    resolve({ success: true });
  }),
  addHealthLog: (plantId, logData) => new Promise(resolve => {
    const newLog = { ...logData, id: `health-${Date.now()}`, plant_id: plantId };
    demoDataStore.update(data => {
      if (!data.healthLogs[plantId]) data.healthLogs[plantId] = [];
      data.healthLogs[plantId] = [newLog, ...data.healthLogs[plantId]].sort((a,b) => new Date(b.date) - new Date(a.date));
      return data;
    });
    resolve(newLog);
  }),
  deleteHealthLog: (plantId, logId) => new Promise(resolve => {
    demoDataStore.update(data => {
        if(data.healthLogs[plantId]) {
            data.healthLogs[plantId] = data.healthLogs[plantId].filter(log => log.id !== logId);
        }
        return data;
    });
    resolve({ success: true });
  }),
  updateUserProfile: (updateData) => new Promise(resolve => {
    user.update(currentUser => {
      const updatedUser = {
        ...currentUser,
        user_metadata: {
          ...currentUser.user_metadata,
          ...updateData
        }
      };
      resolve(updatedUser);
      return updatedUser;
    });
  }),
  deleteUser: () => new Promise(resolve => {
    user.set(null);
    demoDataStore.set(getInitialData());
    resolve({ success: true });
  }),
  suggestSpecies: (imageBase64) => new Promise(resolve => {
    setTimeout(() => {
        if (imageBase64) {
            const suggestions = ['Monstera deliciosa', 'Ficus Lyrata', 'Calathea Orbifolia', 'Strelitzia nicolai'];
            const randomSpecies = suggestions[Math.floor(Math.random() * suggestions.length)];
            resolve({
                species: randomSpecies,
                confidence: Math.random() * (0.98 - 0.75) + 0.75, // Random confidence between 75% and 98%
                message: 'Suggerimento AI simulato.'
            });
        } else {
            resolve({ species: null, confidence: 0, message: 'Nessuna immagine fornita.' });
        }
    }, 1500);
  })

  ,
    addAiAdvice: (plantId, adviceData) => new Promise(resolve => {
    // Simula una risposta AI
    const newAdvice = { 
        ...adviceData, 
        id: `ai-${Date.now()}`, 
        plant_id: plantId,
        date: new Date().toISOString(),
        answer: `Questa è una risposta simulata alla tua domanda: "${adviceData.question}".\nIn una vera applicazione, l'IA analizzerebbe la domanda e l'immagine (se fornita) per darti un consiglio utile sulla cura della tua pianta, come ad esempio controllare il drenaggio del terreno o la quantità di luce solare.`
    };
    demoDataStore.update(data => {
      if (!data.aiAdvices[plantId]) data.aiAdvices[plantId] = [];
      data.aiAdvices[plantId] = [newAdvice, ...data.aiAdvices[plantId]].sort((a,b) => new Date(b.date) - new Date(a.date));
      return data;
    });
    resolve(newAdvice);
  }),

  deleteAiAdvice: (plantId, adviceId) => new Promise(resolve => {
    demoDataStore.update(data => {
        if(data.aiAdvices[plantId]) {
            data.aiAdvices[plantId] = data.aiAdvices[plantId].filter(advice => advice.id !== adviceId);
        }
        return data;
    });
    resolve({ success: true });
  })

};