// src/routes.js
import Login from './routes/Login.svelte';
import Register from './routes/Register.svelte';
import Dashboard from './routes/Dashboard.svelte';
import PlantDetail from './routes/PlantDetail.svelte';
import UserProfile from './routes/UserProfile.svelte';

// Esportiamo le rotte come un oggetto
export const routes = {
  // Catch-all route for auth pages
  '/': Login,
  '/login': Login,
  '/register': Register,

  // Protected routes
  '/dashboard': Dashboard,
  '/plant/:id': PlantDetail, // Rotta dinamica con parametro id
  '/profile': UserProfile,

  // Se nessuna rotta corrisponde, reindirizza al login
  '*': Login, 
};