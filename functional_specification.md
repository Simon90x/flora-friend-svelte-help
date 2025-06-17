
# Functional Specification: FloraFriend - Plant Growth Tracker

## 1. Introduzione

### 1.1. Scopo dell'Applicazione
FloraFriend è un'applicazione web intuitiva progettata per aiutare gli utenti a catalogare le proprie piante, monitorarne la crescita attraverso registri fotografici e testuali, tenere traccia della loro salute e ricevere consigli personalizzati per la cura delle piante sfruttando l'intelligenza artificiale generativa. L'obiettivo è fornire uno strumento centralizzato e facile da usare per migliorare l'esperienza di giardinaggio indoor e outdoor.

### 1.2. Pubblico di Riferimento
L'applicazione è destinata agli appassionati di piante di ogni livello, dai neofiti che necessitano di guida ai coltivatori esperti che desiderano un modo organizzato per tracciare i progressi e la salute del proprio verde. Si rivolge a chiunque apprezzi le piante e voglia prendersene cura al meglio.

## 2. Funzionalità Principali

### 2.1. Autenticazione Utente
*   **Registrazione (`SignupView`)**:
    *   I nuovi utenti possono creare un account fornendo il proprio nome completo, un indirizzo email valido e una password (con requisito di lunghezza minima).
    *   Il sistema verifica se l'email è già in uso.
*   **Login (`LoginView`)**:
    *   Utenti registrati possono accedere inserendo email e password.
    *   Il sistema gestisce credenziali non valide.
*   **Logout (Sidebar)**:
    *   Utenti autenticati possono disconnettersi dall'applicazione tramite un'opzione nella sidebar.
*   **Modalità Demo (`LoginView`)**:
    *   Un pulsante "Demo Mode" permette l'accesso immediato con un account dimostrativo.
    *   I dati in modalità demo sono pre-popolati e le modifiche (aggiunte, eliminazioni) sono temporanee e non persistono tra le sessioni.

### 2.2. Gestione del Profilo Utente (`UserProfileView`)
Accessibile dalla sidebar, questa sezione permette una gestione completa del profilo.
*   **Visualizzazione Profilo**: Mostra l'avatar attuale, il nome completo, l'email (non modificabile) e la data di iscrizione.
*   **Modifica Informazioni Account (`AccountInfoSection`)**:
    *   **Nome**: L'utente può modificare il proprio nome visualizzato.
    *   **Avatar**: L'utente può caricare una nuova immagine del profilo o cambiarla. Include un editor di immagini base (rotazione) prima del salvataggio. È possibile visualizzare l'avatar corrente.
    *   **Favicon Applicazione**: L'utente può caricare un'immagine personalizzata (preferibilmente quadrata, es. 64x64px) per sostituire la favicon predefinita del browser per questa applicazione. Include editor di immagini (rotazione) e opzione per rimuovere la favicon personalizzata.
*   **Sicurezza (`SecuritySection`)**:
    *   **Cambia Password**: L'utente può modificare la password del proprio account, fornendo la password attuale e la nuova password (con conferma).
    *   *Placeholder*: Autenticazione a Due Fattori (2FA), Sessioni Attive.
*   **Preferenze Applicazione (`PreferencesSection`)**:
    *   Informa che le impostazioni di Tema, Carattere e Lingua sono disponibili nella sidebar.
    *   *Placeholder*: Preferenze Notifiche, Unità di Misura.
*   **Gestione Dati (`DataManagementSection`)**:
    *   *Placeholder*: Esporta i Tuoi Dati, Gestione Consensi.
*   **Zona Pericolosa (`DangerZoneSection`)**:
    *   **Elimina Account**: L'utente può richiedere l'eliminazione permanente del proprio account. Una modale di conferma richiederà l'inserimento della password attuale per procedere. Questa azione è irreversibile e cancellerà tutti i dati dell'utente (piante, log, etc.).
*   **Sezioni Placeholder Aggiuntive (`PlaceholderSections`)**:
    *   Statistiche d'Uso, Chiavi API, Dispositivi Autorizzati, Condivisione Partner, Blocco App (PIN).

### 2.3. Dashboard Piante (`DashboardView`)
La schermata principale dopo il login.
*   **Visualizzazione Piante**: Mostra una griglia responsiva di "card" per ogni pianta aggiunta. Ogni card visualizza l'immagine di copertina, il nome, la specie e la data di aggiunta.
*   **Aggiunta Nuova Pianta**: Un pulsante ben visibile ("Add New Plant") apre una modale con il form `AddPlantForm`.
*   **Accesso ai Dettagli Pianta**: Cliccando su una card della pianta, l'utente viene reindirizzato alla `PlantDetailView` specifica per quella pianta.
*   **Stato Vuoto**: Se l'utente non ha ancora aggiunto piante, viene mostrato un messaggio amichevole con un'icona a tema e un pulsante per aggiungere la prima pianta.
*   **Scheletri di Caricamento**: Durante il recupero dei dati delle piante, vengono mostrati dei segnaposto grafici (scheletri) per migliorare l'esperienza utente.
*   **Animazioni**: Le card delle piante appaiono con una leggera animazione all'ingresso.

### 2.4. Aggiunta e Modifica Pianta (`AddPlantForm` in Modal)
*   **Inserimento Dati**: L'utente può inserire:
    *   Nome della pianta (es. "Monstera di Mario").
    *   Specie della pianta (es. "Monstera deliciosa").
    *   Data di acquisizione (calendario).
    *   Note libere (es. provenienza, cure particolari).
    *   Immagine di copertina.
*   **Suggerimento Specie (AI)**: Se un'immagine di copertina è stata caricata, un pulsante "Suggest Species" interroga l'IA (Gemini) per identificare la specie della pianta basandosi sull'immagine. Il campo specie viene popolato con il suggerimento. Viene gestita l'eventualità che l'IA non riconosca la specie o che il servizio non sia disponibile.
*   **Input Immagine (`ImageInput`)**:
    *   Supporta il caricamento di immagini tramite selezione file o drag & drop.
    *   Mostra un'anteprima dell'immagine.
    *   Permette di cambiare o rimuovere l'immagine selezionata.
    *   Offre un'opzione "Edit Image" che apre `ImageEditorModal` per la rotazione.
    *   Le immagini vengono ridimensionate e ottimizzate lato client prima di essere salvate.
*   **Validazione**: Nome e specie sono campi obbligatori.
*   **Modifica Pianta**: Se si modifica una pianta esistente (funzionalità non esplicitamente attivata dalla UI attuale, ma il form la supporta tramite `initialPlant`), il form viene pre-compilato.

### 2.5. Dettaglio Pianta (`PlantDetailView`)
Vista completa dedicata a una singola pianta, organizzata in schede.
*   **Intestazione Pianta**:
    *   Mostra l'immagine di copertina (cliccabile per ingrandire), nome, specie e note della pianta.
    *   Pulsanti Azione: "Add Growth Log", "Ask AI for Advice", "Delete Plant" (conferma richiesta).
*   **Navigazione a Schede**:
    *   **Growth Logs (`GrowthLogsTab`)**:
        *   Elenco cronologico (dal più recente) dei log di crescita. Ogni log mostra:
            *   Foto (cliccabile per ingrandire con `ImageViewerModal`, navigabile se più foto).
            *   Data del log.
            *   Altezza (se registrata).
            *   Note testuali.
            *   Pulsanti per Modificare (apre `AddLogForm` precompilato) o Eliminare il log (con conferma).
        *   **Timeline Scrubber** (solo desktop): Una barra laterale verticale che permette di navigare rapidamente tra i log per data (anno/mese). Evidenzia il log correntemente visualizzato nell'area principale.
        *   Stato vuoto con invito ad aggiungere il primo log se non ne esistono.
    *   **Photo Diary (`PhotoDiaryTab`)**:
        *   Una galleria orizzontale (`HorizontalScroller`) di tutte le foto uniche presenti nei log di crescita, ordinate per data.
        *   Ogni foto è cliccabile per aprirla in `ImageViewerModal` (con navigazione tra le foto del diario).
        *   Stato vuoto se non ci sono foto nei log.
    *   **Plant Health (`PlantHealthTab`)**:
        *   Elenco cronologico dei log relativi alla salute della pianta. Ogni log mostra:
            *   Icona rappresentativa del tipo di osservazione.
            *   Tipo di osservazione (es. "Parassita", "Malattia", "Miglioramento").
            *   Data.
            *   Gravità (Bassa, Media, Alta - se specificata), con badge colorato.
            *   Note dettagliate.
            *   Foto (opzionale, cliccabile per ingrandire).
            *   Pulsante per eliminare il log di salute (con conferma).
        *   Pulsante "Add Health Note" per aprire `AddHealthLogForm`.
        *   Stato vuoto se non ci sono log di salute.
    *   **AI Advice (`AiAdviceTab`)**:
        *   Elenco cronologico delle sessioni di consulenza con l'IA. Ogni entry mostra:
            *   La domanda posta dall'utente (troncata se lunga).
            *   La data della richiesta.
            *   Un'anteprima della risposta dell'IA.
            *   Pulsanti per:
                *   "View Full Advice": Apre `ViewAdviceContent` in una modale per leggere la risposta completa, vedere l'immagine inviata (se presente) e le fonti web citate dall'IA.
                *   "Delete Advice": Elimina la sessione di consiglio (con conferma).
        *   Pulsante "Ask AI for Advice" per aprire `AskAdviceForm`.
        *   Stato vuoto se non sono stati richiesti consigli.
    *   **Examples (`ExampleImagesTab`)**:
        *   Mostra una galleria orizzontale (`HorizontalScroller`) di immagini di esempio generiche a scopo illustrativo (non specifiche della pianta corrente).
        *   Include un disclaimer.
        *   Le immagini sono cliccabili per aprirle in `ImageViewerModal`.

### 2.6. Aggiunta e Modifica Log di Crescita (`AddLogForm` in Modal)
*   **Inserimento Dati**:
    *   Data del log (calendario, preimpostato a oggi).
    *   Foto (obbligatoria): Tramite `ImageInput` con anteprima ed editor (rotazione).
    *   Altezza (opzionale, numerica, in cm).
    *   Note testuali (es. "nuove foglie", "fioritura").
*   **Validazione**: La foto è obbligatoria.
*   **Modifica Log**: Se si modifica un log esistente, il form è precompilato. Il titolo della modale riflette l'azione (Aggiungi/Modifica).

### 2.7. Aggiunta Log Salute Pianta (`AddHealthLogForm` in Modal)
*   **Inserimento Dati**:
    *   Data osservazione (calendario, preimpostato a oggi).
    *   Tipo di osservazione: Selezionabile da un menu a tendina (es. Peste, Malattia, Carenza nutrienti, Problema irrigazione/luce, Miglioramento, Altro).
    *   Gravità (opzionale): Selezionabile da un menu a tendina (Bassa, Media, Alta).
    *   Note dettagliate: Descrizione dell'osservazione.
    *   Foto (opzionale): Tramite `ImageInput` con anteprima ed editor (rotazione).
*   **Validazione**: Tipo di osservazione e note sono obbligatori.

### 2.8. Richiesta Consigli IA (`AskAdviceForm` in Modal)
*   **Contesto Pianta**: Il form è specifico per la pianta selezionata (il nome appare nel titolo).
*   **Domanda**: Campo di testo libero per l'utente.
*   **Selezione Immagine Contestuale**:
    *   Se la pianta ha foto nel suo diario, viene mostrato un `HorizontalScroller` con le anteprime.
    *   L'utente può cliccare su una foto per selezionarla e inviarla insieme alla domanda.
    *   Viene mostrata un'anteprima dell'immagine selezionata, con possibilità di rimuoverla.
    *   Se non ci sono immagini nel diario, viene mostrato un messaggio informativo.
*   **Invio e Risposta**:
    *   Al submit, la domanda (e l'eventuale base64 dell'immagine) viene inviata al `geminiService`.
    *   Durante l'attesa, il pulsante di invio mostra uno stato di caricamento.
    *   Eventuali errori vengono mostrati nel form.
    *   In caso di successo, la risposta viene salvata tramite `apiService` e visualizzata (vedi Flow).

### 2.9. Visualizzazione Consigli IA (`ViewAdviceContent` in Modal)
*   **Contenuto Mostrato**:
    *   Immagine allegata alla domanda (se presente).
    *   La domanda originale dell'utente.
    *   La risposta completa fornita dall'IA, formattata da Markdown per una migliore leggibilità (paragrafi, liste, grassetto, etc.).
    *   Se l'IA ha utilizzato fonti web (Google Search grounding), queste vengono elencate come link cliccabili.

### 2.10. Personalizzazione Interfaccia (nella `Sidebar`)
*   **Tema**:
    *   Opzioni: "Light", "Dark", "Random Style".
    *   "Light" e "Dark" applicano palette di colori predefinite.
    *   "Random Style" seleziona un colore primario casuale da una lista predefinita e genera una palette armonica per la modalità base (chiara/scura) correntemente attiva, garantendo contrasti accessibili.
    *   La preferenza (modalità base, tipo di tema, colore primario custom) viene salvata in `localStorage`.
*   **Carattere**:
    *   Due menu a tendina separati per:
        *   Font del corpo del testo (lista di font sans-serif).
        *   Font dei titoli (lista di font serif).
    *   La selezione viene applicata dinamicamente e salvata in `localStorage`.
*   **Lingua**:
    *   Menu a tendina per selezionare la lingua dell'interfaccia (Inglese, Italiano).
    *   La selezione viene applicata dinamicamente e salvata in `localStorage`.
*   Tutte le sezioni di personalizzazione sono implementate come `CollapsibleSection` per un'interfaccia pulita.

### 2.11. Navigazione e Layout Generale
*   **Layout Principale**:
    *   Su desktop (schermi > 1024px), la `Sidebar` è permanentemente visibile a sinistra, e il contenuto principale (`DashboardView`, `PlantDetailView`, `UserProfileView`) occupa lo spazio rimanente.
    *   Su mobile (< 1024px), la `Sidebar` è nascosta per impostazione predefinita.
*   **Sidebar Mobile**:
    *   Un pulsante "hamburger" (`Bars3Icon`) nella barra superiore mobile apre la `Sidebar`.
    *   Quando aperta, la `Sidebar` si sovrappone al contenuto principale e uno sfondo sfocato copre il resto della pagina.
    *   La chiusura avviene cliccando l'icona "X" nella sidebar, cliccando sullo sfondo sfocato, o selezionando una voce di navigazione.
    *   Focus management per accessibilità: quando la sidebar si apre, il focus si sposta su un elemento al suo interno; alla chiusura, il focus torna al pulsante hamburger.
*   **Barra Superiore Mobile**: Visibile solo su mobile quando la sidebar è chiusa. Contiene il pulsante menu e il nome dell'applicazione con un'icona.

### 2.12. Gestione Immagini Avanzata
*   **Input Immagine (`ImageInput`)**:
    *   Ridimensionamento e compressione lato client (JPEG, qualità 0.8, dimensioni massime definite in `constants.ts` o target specifici) per tutte le immagini caricate (copertina pianta, log crescita, log salute, avatar, favicon).
*   **Editor Immagini (`ImageEditorModal`)**:
    *   Permette la rotazione di 90° dell'immagine caricata o corrente prima del salvataggio.
    *   Gestisce immagini sia in formato base64 che URL (queste ultime vengono convertite in base64 prima di aprire l'editor).
*   **Visualizzatore Immagini (`ImageViewerModal`)**:
    *   Modale per visualizzare immagini a una dimensione maggiore.
    *   Supporta la navigazione tramite frecce (su schermo e da tastiera) se viene fornita una lista di URL di immagini.
    *   Chiudibile con tasto 'Escape' o click sullo sfondo.

## 3. Flussi Utente Principali (Esempi)

### 3.1. Registrazione e Primo Accesso
1.  Utente apre l'app: visualizza `LoginView`.
2.  Clicca su "Sign Up". `App` passa a `SignupView`.
3.  Compila form di registrazione, clicca "Sign Up".
4.  Se successo, `App` passa a `DashboardView`. Se errore, `SignupView` mostra messaggio.
5.  (Opzionale) Utente apre la Sidebar (da menu hamburger su mobile), naviga nelle sezioni "Theme", "Font", "Language" e personalizza l'app. Le modifiche sono immediate.

### 3.2. Aggiunta e Monitoraggio Completo di una Pianta
1.  Da `DashboardView`, utente clicca "Add New Plant".
2.  Si apre modale con `AddPlantForm`. Utente inserisce nome, carica foto di copertina.
3.  Clicca "Suggest Species". L'IA popola il campo specie.
4.  Inserisce data e note. Salva. La pianta appare nella `DashboardView`.
5.  Clicca sulla nuova pianta. `App` passa a `PlantDetailView`.
6.  Nella scheda "Growth Logs", clicca "Add Growth Log".
7.  Si apre modale con `AddLogForm`. Inserisce data, carica foto, note, altezza. Salva. Il log appare.
8.  Nota un problema sulla pianta. Va alla scheda "Plant Health", clicca "Add Health Note".
9.  Si apre modale con `AddHealthLogForm`. Seleziona tipo "Pest", gravità "Medium", descrive il problema e carica foto della foglia malata. Salva. La nota appare.
10. Ha un dubbio. Va alla scheda "AI Advice", clicca "Ask AI for Advice".
11. Si apre modale con `AskAdviceForm`. Scrive "Come tratto gli afidi sulla mia Monstera?" e seleziona la foto della foglia malata dal diario. Invia.
12. Dopo il caricamento, si apre modale `ViewAdviceContent` con la risposta dell'IA e le fonti. Chiude la modale. Il consiglio è ora listato.
13. Torna alla scheda "Photo Diary" e scorre le foto della sua pianta.

### 3.3. Modifica Profilo e Favicon
1.  Dalla Sidebar, utente clicca sul proprio nome/avatar. `App` passa a `UserProfileView`.
2.  Nella sezione "Account Information", cambia il nome e salva.
3.  Clicca "Change Avatar", carica una nuova foto. (Opzionale) Clicca "Edit Image" per ruotarla. Salva l'avatar.
4.  Scorre fino a "Application Icon (Favicon)". Clicca "Change Favicon", carica un piccolo file .png. Salva. La favicon del browser si aggiorna.
5.  Va alla sezione "Security", inserisce password attuale, nuova password e conferma. Salva la nuova password.
6.  Viene mostrato un messaggio di successo per ogni operazione.

## 4. Considerazioni Tecniche Non Funzionali

*   **Offline Functionality**:
    *   Le preferenze UI (tema, font, lingua, favicon personalizzata) sono salvate in `localStorage` e applicate anche offline.
    *   L'accesso ai dati delle piante, log, e funzionalità AI richiede connettività a Supabase/Gemini. L'app non è progettata per un uso offline esteso dei dati dinamici.
*   **Responsiveness**:
    *   L'interfaccia è completamente responsiva, adattandosi a schermi desktop, tablet e mobile, grazie a Tailwind CSS e a un design flessibile dei componenti.
    *   La sidebar collassa in un menu hamburger su schermi piccoli.
    *   Griglie e layout si adattano per una leggibilità ottimale.
*   **Accessibility (ARIA)**:
    *   Uso di attributi ARIA come `aria-label`, `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal="true"` per modali e sezioni collassabili.
    *   Contrasti di colore gestiti dinamicamente per i temi personalizzati per rispettare i requisiti WCAG (obiettivo).
    *   Focus management per modali e sidebar mobile.
    *   Input con etichette associate correttamente.
*   **Performance**:
    *   Immagini caricate nelle card della dashboard (`PlantCard`) utilizzano `loading="lazy"`.
    *   Uso di componenti "scheletro" (`PlantCardSkeleton`, `LogItemSkeleton`, `DetailSectionSkeleton`) per indicare caricamento dati.
    *   Ridimensionamento e compressione delle immagini lato client (`ImageInput`) prima dell'invio o salvataggio per ridurre il payload e i costi di storage/banda.
    *   Memoizzazione (`React.useMemo`, `React.useCallback`) usata selettivamente per ottimizzare re-render.
    *   Paginazione o virtualizzazione non sono implementate per le liste lunghe, ma potrebbero essere necessarie in futuro.
*   **Cross-Browser Compatibility**:
    *   Sviluppato con tecnologie web standard (React, Tailwind CSS) che mirano a una buona compatibilità con i browser moderni (Chrome, Firefox, Safari, Edge versioni recenti).
    *   La personalizzazione dello scrollbar è specifica per WebKit, ma non impatta la funzionalità base su altri browser.

---
*End of Functional Specification*
