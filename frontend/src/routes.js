// src/routes.js
import { wrap } from 'svelte-spa-router/wrap';

// Importa le viste
import Login from './routes/Login.svelte';
import Register from './routes/Register.svelte';
import Dashboard from './routes/Dashboard.svelte';
import PlantDetail from './routes/PlantDetail.svelte';
import UserProfile from './routes/UserProfile.svelte';

// Importa lo store utente per le guardie di rotta
import { user } from './lib/stores/index.js';

// Condizione per le rotte protette: l'utente deve esistere
const conditions = [
  () => {
    let currentUser;
    const unsubscribe = user.subscribe(u => { currentUser = u; });
    unsubscribe(); // Esegui e annulla subito l'iscrizione
    
    // Se l'utente non è loggato (è null), non soddisfa la condizione
    return currentUser !== null;
  }
];

export const routes = {
  // Pagine pubbliche
  '/': Login,
  '/login': Login,
  '/register': Register,

  // Pagine protette
  '/dashboard': wrap({ component: Dashboard, conditions }),
  '/plant/:id': wrap({ component: PlantDetail, conditions }),
  '/profile': wrap({ component: UserProfile, conditions }),

  // Se nessuna rotta corrisponde, reindirizza al login (o dashboard se loggato)
  '*': wrap({
    component: Login,
    conditions: [
      () => {
        let currentUser;
        const unsubscribe = user.subscribe(u => { currentUser = u; });
        unsubscribe();
        return currentUser === null;
      }
    ],
    userData: { redirect: '/dashboard' } // Se la condizione fallisce, reindirizza qui
  }),
};