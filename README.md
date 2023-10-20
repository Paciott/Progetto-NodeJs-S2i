# Progetto Node.js - Information per Start2Impact

## Descrizione

Il progetto prevede la creazione di REST API utilizzando Nodejs, nel caso specifico si è ipotizzato di avere un'app dove è possibile registrare utenti, postare contenuti e interagire con i post attraverso like o commenti.

Ho utilizzato MySQL come database, a cui mi sono interfacciato direttamente tramite la creazione di una pool che utilizza [mysql2](https://www.npmjs.com/package/mysql2) come client.

Per quanto riguarda il testing, ho creato degli unit test capillari generando oggetti di mock e stub. Questi oggetti vengono utilizzati per simulare il comportamento delle funzioni e degli oggetti reali durante l'esecuzione dei test. Tutto ciò è stato fatot utilizzando librerie come [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) e [Sinon](https://sinonjs.org/).

## Costruito con:

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/it/)
- [MySQL](https://www.mysql.com/it/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Sinon](https://sinonjs.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)

## Configurazione

1. Clona il progetto in locale, poi esegui `npm install` per installare tutte le dipendenze necessarie.
2. Modifica il file `.env` e inserisci al suo interno i dati richiesti, fra cui la porta sulla quale vuoi avviare il server (se omessa di default è 3000).
3. Utilizzare il file `migrations.sql` presente nel progetto per creare il database.
4. Eseguire `npm run dev` per avviare l'ambiente di sviluppo e testare l'app.

## Script NPM

Puoi eseguire questi script con `npm run`:

- `dev`: avvia il server di sviluppo.
- `test_index`: esegue gli unit test relativi al funzionamento del server.
- `test_users`: esegue gli unit test relativi al funzionamento delle operazioni CRUD relative agli user.
- `test_posts`: esegue gli unit test relativi al funzionamento delle operazioni CRUD relative ai post.
- `test_interactions`: esegue gli unit test relativi al funzionamento delle operazioni CRUD relative alle interazioni.

## Come utilizzare le REST API

Attraverso gli endpoint abbiamo la possibilità di leggere, inserire, cancellare e filtrare record come utenti, post e interazioni.

### `GET`

- `/users`: ritorna tutti gli utenti.
- `/users/{user_id}`: ritorna l'utente corrispondente all'id specificato.
- `/posts`: ritorna tutti i post.
- `/posts?date={YYYY-MM-DD}`: ritorna tutti i post inseriti nella data specificata.
- `/posts?author_id={author_id}`: ritorna tutti i post inseriti da un determinato utente.
- `/posts?author_id={author_id}&date={YYYY-MM-DD}`: ritorna tutti i post inseriti da un determinato utente e nella data specificata.
- `/posts/{post_id}`: ritorna il post associato all'id con aggregate tutte le sue interazioni.
- `/posts/{post_id}?date={YYYY-MM-DD}`: ritorna il post associato all'id con aggregate le sue interazioni filtrate per data.
- `/posts/{post_id}?city={city}`: ritorna il post associato all'id con aggregate le sue interazioni filtrate per luogo.
- `/posts/{post_id}?date={YYYY-MM-DD}&city={city}`: ritorna il post associato all'id con aggregate le sue interazioni filtrate per data e luogo.

### `POST`

- `/users`: registra un utente.
  - Body:
    ```json
    {
      "nickname": "String",
      "age": "Int",
      "city": "String"
    }
    ```
- `/posts`: permette di creare un nuovo post inserendo il titolo e l'autore.
  - Body:
    ```json
    {
      "title": "String",
      "author_id": "Int"
    }
    ```
- `/interactions`: permette di inserire un'interazione specificando il tipo di interazione, l'id dell'autore, l'id del post e il tipo di interazione (like o commento).
  - Body:
    ```json
    {
      "type": "String",
      "author_id": "Int",
      "post_id": "Int",
      "content": "String" || null // la natura del content dipende se l'interazione è un commento o un like
    }
    ```

### `PUT`

- `/users/{user_id}`: aggiorna le informazioni dell'utente con l'id specificato.

  - Body:
    ```json
    {
      "nickname": "String",
      "age": "Int",
      "city": "String"
    }
    ```

- `/posts/{post_id}`: modifica il titolo del post con l'id specificato.

  - Body:
    ```json
    {
      "title": "String",
      "author_id": "Int"
    }
    ```

- `/interactions/{interaction_id}`: modifica l'interazione specificata con l'id.
  - Body:
    ```json
    {
      "type": "String",
      "author_id": "Int",
      "content": "String" || null  // la natura del content dipende se l'interazione è un commento o un like
    }
    ```

### `DELETE`

- `/users/{user_id}`: cancella l'utente con l'id specificato.
- `/posts/{post_id}`: cancella il post corrispondente all'id specificato.
  - Body:
    ```json
    {
      "author_id": "Int"
    }
    ```
- `/interactions/{interaction_id}`: cancella l'interazione associata all'id specificato.
  - Body:
    ```json
    {
      "author_id": "Int"
    }
    ```