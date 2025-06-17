# Flora Friend - Documentazione

...existing documentation...

## Flussi Base

### Login
La pagina di login consente di accedere al sistema tramite:
  - Autenticazione con email e password tramite Supabase.
  - Modalità demo, che bypassa il login e imposta un utente fittizio.

### Registrazione
Gli utenti non registrati possono creare un nuovo account nella pagina di registrazione.  
Una volta registrati, verranno reindirizzati al Dashboard.

### Dashboard
Nel dashboard gli utenti vedono i propri dati (nome ed email).  
È disponibile un pulsante per il logout, che resettando i dati dell'utente, li riporta alla pagina di login.

### Modalità Demo
In ogni flusso, la modalità demo è sempre accessibile:  
Premendo il pulsante "Accedi in modalità demo" dalla pagina di login verrà impostato un utente fittizio (demo@example.com, Demo User) e l'accesso agli altri flussi (dashboard, logout, registrazione) sarà abilitato.

...existing documentation...
