import { writable } from 'svelte/store';

// Lo store conterrà un array di oggetti notifica
export const notifications = writable([]);

/**
 * Aggiunge una nuova notifica allo store.
 * @param {string} message - Il testo della notifica.
 * @param {object} [options] - Opzioni aggiuntive.
 * @param {'success'|'error'|'info'} [options.type='info'] - Il tipo di notifica (per lo stile).
 * @param {number} [options.timeout=3000] - Millisecondi prima della rimozione automatica.
 */
function push(message, options = {}) {
  const { type = 'info', timeout = 3000 } = options;
  
  // Creiamo un ID univoco per ogni notifica per usarlo come chiave nel ciclo #each
  // e per la rimozione.
  const id = crypto.randomUUID();

  const newNotification = {
    id,
    message,
    type,
    timeout,
  };

  // Aggiungiamo la nuova notifica in cima all'array
  notifications.update((all) => [newNotification, ...all]);

  // Impostiamo un timer per rimuovere la notifica dopo il timeout
  if (timeout) {
    setTimeout(() => remove(id), timeout);
  }

  return id;
}

/**
 * Rimuove una notifica dallo store tramite il suo ID.
 * @param {string} id - L'ID della notifica da rimuovere.
 */
function remove(id) {
  notifications.update((all) => all.filter((n) => n.id !== id));
}

// Esportiamo un oggetto "toast" per un'API pulita e intuitiva
export const toast = {
  push,
  remove,
};