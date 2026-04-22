# Documentazione Utente

## Panoramica

Untitled Delivery Project è una piattaforma di consegna a domicilio di cibo che connette clienti e corrieri attraverso il tracciamento GPS in tempo reale, l'assegnazione automatica degli ordini e la navigazione passo-passo.

### Ruoli disponibili

Il sistema supporta due ruoli distinti:

- **Cliente** -- effettua ordini presso ristoranti e ne traccia la consegna in tempo reale
- **Corriere** -- riceve ordini assegnati, naviga verso il ristorante e la destinazione, e completa la consegna

---

## Per iniziare

### Requisiti

- Un browser web moderno (Chrome, Firefox, Edge, Safari)
- Consenti l'accesso alla posizione GPS nel browser
- Una connessione Internet attiva

### Accesso alla piattaforma

1. Apri il browser e accedi all'URL della piattaforma
2. Verrai condotto alla pagina iniziale (Homepage)
3. Usa la barra di navigazione in alto per accedere alle diverse sezioni

---

## Interfaccia Cliente

### Pagina Principale (Homepage)

La homepage presenta una vista introduttiva con sezioni informative:

- **Hero section** -- titolo e descrizione del servizio con frecce animate
- **Ristoranti** -- panoramica del servizio di consegna
- **Come funziona** -- procedura in 4 passaggi
- **Diventa corriere** -- link alla pagina dedicata

### Effettuare un Ordine

1. Clicca su **"Ordina ora"** per accedere alla pagina ordini
2. La mappa interattiva mostra la posizione corrente e le opzioni disponibili
3. Usa la **barra di ricerca** per trovare un ristorante:
   - Digita il nome o l'indirizzo
   - I risultati appaiono con autocomplete (debounce di 250ms)
   - Naviga tra i risultati con i tasti freccia su/giù e conferma con Invio
   - Il risultato selezionato evidenzia la geometria OSM sulla mappa
4. Seleziona i piatti dal menà del ristorante (i card mostrano nome, immagine e prezzo)
5. Gli articoli aggiunti appaiono nel **carrello** (icona nella barra di navigazione)
6. Clicca su **"Invia il tuo ordine"** per confermare

### Stato dell'Ordine

Dopo l'invio dell'ordine, lo stato viene aggiornato in tempo reale:

| Stato | Descrizione |
|-------|-------------|
| **In coda (Queued)** | L'ordine è in attesa di assegnazione a un corriere |
| **Assegnato (Assigned)** | Un corriere è stato assegnato all'ordine |
| **In consegna (Delivering)** | Il corriere sta portando l'ordine |
| **Consegnato (Completed)** | L'ordine è stato consegnato con successo |

Lo stato viene visualizzato in un popup modale e aggiornato tramite polling dell'API ogni 3 secondi.

### Tracciamento del Corriere

Quando il corriere viene assegnato:
1. Un popup mostra lo stato "Corriere assegnato" con l'ID del corriere
2. La mappa inizia a mostrare la posizione in tempo reale del corriere
3. Il corriere viene visualizzato con un'icona personalizzata sulla mappa
4. La posizione si aggiorna in tempo reale tramite WebSocket

### Navigazione tra Ruoli

Su entrambe le pagine (Clienti e Corrieri) è presente un link per passare all'altro ruolo, nel caso in cui si desideri testare entrambe le interfacce.

---

## Interfaccia Corriere

### Accesso

1. Clicca su **"Corriere"** nella barra di navigazione, oppure
2. Usa il link "Diventa corriere" dalla homepage
3. L'URL richiede un parametro `courierId` (es. `RiderPage?courierId=0000`)
4. Se non specificato, viene usato automaticamente un valore predefinito

### Ricezione di un Ordine

1. Il sistema verifica periodicamente (ogni 3 secondi) la presenza di nuovi ordini assegnati
2. Quando arriva un ordine, appare un pannello laterale con i dettagli:
   - **ID Ordine** -- identificativo univoco
   - **Articoli** -- lista degli elementi ordinati
   - **Prezzo totale** -- importo totale dell'ordine
   - **Indirizzo ristorante** -- punto di ritiro
   - **Indirizzo destinazione** -- punto di consegna

### Navigazione

Il sistema fornisce navigazione GPS integrata:

1. **Calcolo del percorso** -- il percorso viene tracciato automaticamente sulla mappa dal corriere al ristorante, e poi alla destinazione
2. **Istruzioni passo-passo** -- una scheda mostra le istruzioni di navigazione con:
   - Distanza dal prossimo segnale
   - Tipo di manovra (girare a destra/sinistra, dritto, rotatoria, ecc.)
3. **Indicazioni contestuali** -- messaggi di prossimità:
   - "Raggiungi il ristorante"
   - "Ritira l'ordine"
   - "Raggiungi la destinazione"
   - "Completa l'ordine"
4. **Ricalcolo automatico** -- se il corriere si discosta più di 25 metri dal percorso, il sistema ricalcola automaticamente la rotta

### Completamento dell'Ordine

1. Quando il corriere raggiunge la destinazione, clicca su **"Completa ordine"**
2. L'ordine passa allo stato "Consegnato"
3. Il corriere torna in attesa di nuovi ordini

---

## Funzionalità della Mappa

### Componenti della mappa

- **Mappa interattiva** -- basata su MapLibre GL con tile da OpenStreetMap
- **Segnaposto personalizzati** -- icone distinte per ristorante (pickup) e corriere in movimento
- **Controllo geolocalizzazione** -- pulsante per centrare la mappa sulla posizione corrente
- **Tooltip coordinate** -- mostra le coordinate lat/lng del puntatore del mouse (5 cifre decimali)
- **Evidenzia geometria OSM** -- cliccando su un risultato di ricerca, la geometria viene evidenziata sulla mappa

### Ricerca

La funzione di ricerca utilizza Nominatim (OpenStreetMap geocoding):

- Autocomplete con debounce di 250ms
- Navigazione tastiera (freccia su/giù/Invio/Esc)
- Rilevamento automatico del tipo di risultato (indirizzo civico o punto di interesse generico)
- Zoom automatico sui risultati tramite bounding-box

---

## Impostazioni

### Lingua

Il sistema supporta tre lingue:

| Lingua | Codice |
|--------|--------|
| Italiano | it |
| English | en |
| Español | es |

Per cambiare lingua:
1. Clicca sull'icona del linguaggio nella barra di navigazione
2. Seleziona la lingua desiderata dal menu a tendina con bandiere
3. La scelta viene memorizzata in un cookie e persiste tra le sessioni

### Modalità debug

È disponibile una modalità debug accessibile tramite la pagina di test:
- **TestPage** -- mostra le coordinate grete del GPS per verificare il funzionamento della geolocalizzazione
- **TrackPage** -- dashboard di test per il tracciamento WebSocket con controlli manuali

---

## Risoluzione dei problemi

### Problema | Soluzione
---|---
La mappa non si carica | Controlla la connessione Internet e ricarica la pagina
La geolocalizzazione non funziona | Assicurati di aver concesso l'accesso alla posizione nel browser
L'ordine non viene assegnato | Verifica che ci siano corrieri online; l'ordine viene accodato in attesa
Il corriere non appare sulla mappa | Verifica che il GPS sia attivo e che il WebSocket sia connesso
La ricerca non restituisce risultati | Prova con un indirizzo o nome diverso; Nominatim può avere dati incompleti per alcune aree
L'applicazione è lenta | Controlla la velocità di connessione; il polling è impostato a 3 secondi

---

## Note sulla privacy

- Le coordinate GPS vengono trasmesse solo durante l'uso attivo del servizio
- I dati vengono memorizzati in Redis con scadenza automatica (TTL)
- Le posizioni dei corrieri scadono dopo 5 minuti se non aggiornate
- Gli ordini scadono dopo 60 minuti se non completati
