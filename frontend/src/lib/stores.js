import { writable } from 'svelte/store';

const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const user = writable(initialUser);
// Salva le modifiche nello store nel localStorage
user.subscribe(value => {
    localStorage.setItem('user', JSON.stringify(value));
});

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
