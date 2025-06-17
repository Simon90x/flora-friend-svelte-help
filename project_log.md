# Project Log (Cronostoria)

Questo file documenta tutte le scelte architetturali, le modifiche e i ragionamenti fatti durante lo sviluppo della web app Flora Friend.

---

## [2025-06-17] Inizio progetto
- Definito stack tecnologico: Svelte 5 (frontend), Supabase (backend/API REST).
- Creato piano di azione dettagliato per step incrementali.
- Scelta nome file di log: `project_log.md`.
- Creata struttura base delle cartelle: `/frontend` per il client Svelte.

---

## [2025-06-17] Setup progetto Svelte 5
- Inizializzato progetto Svelte 5 nella cartella `/frontend` usando Vite come starter.
- Installate tutte le dipendenze di base con `npm install`.
- Prossimo step: configurazione linting, formattazione automatica e strumenti di sviluppo.

---

## [2025-06-17] Configurazione linting e formattazione
- Installati Prettier ed ESLint per JS/TS.
- Creati file `.prettierrc`, `.prettierignore`, `.eslintrc.cjs`, `.eslintignore` nella cartella `/frontend`.
- NOTA: Il supporto linting per Svelte 5 non è ancora disponibile nei plugin ESLint. Aggiorneremo la configurazione appena sarà rilasciato.

---

## [2025-06-17] Struttura base pagine e variabili ambiente
- Creati componenti base: `Layout.svelte`, `Home.svelte`, `Login.svelte` in `/src/lib`.
- Aggiornato `App.svelte` per usare la nuova struttura.
- Creato file `.env` per variabili Supabase e `stores.js` per stato globale e configurazione.
- Pronto per integrazione Supabase e sviluppo flussi utente.

---

## [2025-06-17] Integrazione Supabase
- Installato `@supabase/supabase-js`.
- Creato file `supabaseClient.js` per l'inizializzazione del client e funzioni di accesso dati.
- Pronto per implementare autenticazione e primi flussi CRUD.

---

## [2025-06-17] UI/UX Foundation: Skeleton UI
- Scelta e installata Skeleton UI, la libreria Svelte più avanzata per UX, accessibilità e reattività.
- Importati i CSS di base e tema in `main.js`.
- Pronto per utilizzare componenti Skeleton in tutta l'app.

---

## [2025-06-17] Autenticazione Supabase
- Implementato form di login con Supabase Auth e componenti Skeleton UI.
- Creato componente UserStatus per mostrare stato utente e logout.
- Aggiornato App.svelte per gestire flusso autenticato/non autenticato.

---

## [2025-06-17] Flussi utente principali (MVP)
- Definite entità principali: Pianta, Log crescita, Log salute, Consigli AI, Utente.
- Creati componenti: Dashboard, PlantDetail, UserProfile, Sidebar, navigation store.
- Implementata navigazione base tra dashboard, dettaglio pianta e profilo tramite stato.
- Pronto per aggiungere modali, CRUD e logiche avanzate.

---
