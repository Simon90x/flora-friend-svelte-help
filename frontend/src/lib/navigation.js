import { writable } from 'svelte/store';

export const page = writable('dashboard'); // dashboard | plantDetail | profile | ...
export const selectedPlant = writable(null); // Pianta selezionata per dettaglio
