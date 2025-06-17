// src/main.js
import { mount } from 'svelte'; // 1. Importa 'mount' da 'svelte'
import './app.css';
import App from './App.svelte';

// 2. Usa la funzione 'mount' invece di 'new App'
const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;