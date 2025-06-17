// src/lib/stores.js
import { writable } from 'svelte/store';

// Store per l'utente. Inizia come 'undefined' per gestire lo stato di caricamento iniziale.
export const user = writable(undefined);

// Store per la navigazione. Determina quale "pagina" mostrare.
export const page = writable('login'); // 'login', 'register', 'dashboard', 'profile', 'plantDetail'

// Store per la pianta selezionata (utile per la pagina di dettaglio)
export const selectedPlant = writable(null);

// Store per lo stato della sidebar su mobile
export const isSidebarOpen = writable(false);

// Le variabili d'ambiente sono gestite da Vite, non serve esportarle da qui
// export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;