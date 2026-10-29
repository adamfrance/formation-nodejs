# Énoncés des exercices — Jour 2

Formation « Node.js, programmation JavaScript côté serveur » — Réf. NJS-SPE. Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 1.3-C — Importer des tâches depuis une API (10 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `scripts/import-remote.js`.
2. Y définir `REMOTE_URL` : la variable d'environnement `REMOTE_URL`, sinon `https://jsonplaceholder.typicode.com/todos?_limit=5`.
3. Y écrire `fetchRemoteTodos(url = REMOTE_URL, timeoutMs = 5000)` sur le modèle de `../demos/appel-api.js` : délai maximal, test de `res.ok`, erreur si la réponse n'est pas un tableau.
4. Y écrire `importRemote(url)`, qui lit les tâches locales avec `readTasks` de `./stats` (exercice 1.3-A d'hier, rappelé ci-dessous).
5. Y convertir chaque élément reçu `{ id, title, completed }` en `{ id, title, done }`, avec un nouvel identifiant local : le plus grand identifiant, plus 1.
6. Y ignorer un élément dont le titre existe déjà.
7. Écrire toutes les tâches dans `data/tasks.json.tmp`, puis renommer ce fichier en `data/tasks.json` avec `fs.rename`.
8. Si le script est lancé directement (`require.main === module`) : afficher le nombre de tâches importées ; en cas d'erreur, afficher un message lisible (« délai dépassé » pour une `TimeoutError`) et terminer avec le code de sortie 1.
9. Lancer deux fois `node scripts/import-remote.js`.

Le fichier `scripts/stats.js` de l'exercice 1.3-A, à créer s'il manque. S'il existe, vérifier sa ligne `module.exports` : elle doit contenir `FILE`.

Fichier `taskflow/scripts/stats.js` :

```js
const fs = require('node:fs/promises');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'tasks.json');

async function readTasks(file = FILE) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, '[]\n');
      return [];
    }
    throw err;
  }
}

function computeStats(tasks) {
  const done = tasks.filter((t) => t.done).length;
  return { total: tasks.length, done, todo: tasks.length - done };
}

module.exports = { readTasks, computeStats, FILE };

if (require.main === module) {
  readTasks()
    .then((tasks) => console.table(computeStats(tasks)))
    .catch((err) => { console.error('Lecture impossible :', err.message); process.exit(1); });
}
```

Résultat attendu : `5 tâche(s) importée(s)`, puis `0 tâche(s) importée(s)`.

## Exercice 1.5-A — Les utilitaires HTTP (4 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `src/http-utils.js`.
2. Y copier `HttpError`, `send` et `readBody` depuis `../demos/corps-demo.js`.
3. Y écrire la fonction `readJson(req)` : lire le corps avec `readBody` ; corps vide : renvoyer `{}` ; JSON invalide : lever `new HttpError(400, 'JSON invalide')`.
4. Terminer le fichier par `module.exports = { HttpError, send, readBody, readJson };`.
5. Lancer `node -e "console.log(Object.keys(require('./src/http-utils')))"`.

Résultat attendu : `[ 'HttpError', 'send', 'readBody', 'readJson' ]`.

## Exercice 1.5-C — PUT et DELETE (8 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Ouvrir le fichier `src/server.js`.
2. Avant `const server = …`, ajouter la route `PUT /api/tasks/:id` : `store.update` avec `validate(…, { partial: true })` ; répondre 200 avec la tâche, ou 404 si elle n'existe pas.
3. Ajouter la route `DELETE /api/tasks/:id` : `store.remove` ; répondre 204, ou 404 si la tâche n'existe pas.
4. Terminal 2 : modifier la tâche 2, puis la supprimer deux fois.

```bash
curl -s -X PUT localhost:3000/api/tasks/2 -H 'Content-Type: application/json' -d '{"done":true}'
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE localhost:3000/api/tasks/2
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE localhost:3000/api/tasks/2
```

Résultat attendu : la tâche 2 avec `"done":true`, puis `204`, puis `404`.

## Exercice 2.2-2 — Le journal des requêtes (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `src/middleware/requestLogger.js`.
2. Y écrire la fonction `requestLogger(req, res, next)` : noter l'instant d'arrivée avec `process.hrtime.bigint()` ; quand la réponse est envoyée (événement `finish` de `res`), afficher la méthode, l'URL (`req.originalUrl`), le statut et la durée en millisecondes ; appeler `next()`.
3. Exporter `requestLogger`.
4. Dans `src/app.js`, l'importer et le brancher avec `app.use`, avant `express.json()`.
5. Relancer `npm start`, puis envoyer deux fois `curl -s localhost:3000/api/health`.

Résultat attendu : une ligne `GET /api/health 200 … ms` par appel, dans le terminal du serveur.

## Exercice 2.3-C — Brancher TaskFlow sur PostgreSQL (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Installer Sequelize et le pilote : `npm install sequelize pg`. npm signale « 2 moderate severity vulnerabilities » : elles viennent d'`uuid`, dans des fonctions que Sequelize n'utilise pas ; ne pas lancer `npm audit fix --force`, qui installerait Sequelize 3.
2. Créer le fichier `src/config.js`, le seul à lire `process.env`. Y exporter `isTest` (`NODE_ENV` vaut `test`), `isProd`, `port` (3000 par défaut), `databaseUrl` (`DATABASE_URL_TEST` en test, `DATABASE_URL` sinon, avec par défaut les adresses des bases `taskflow_test` et `taskflow`), `sqlLogging` (`SQL_LOG` vaut `1`) et `corsOrigin` (`http://localhost:3000` par défaut).
3. Créer le fichier `.env.example` avec `PORT`, `DATABASE_URL`, `DATABASE_URL_TEST` et `CORS_ORIGIN`, puis le copier : `cp .env.example .env`.
4. Créer le fichier `src/models/index.js` : une instance de `Sequelize` sur `config.databaseUrl`, dialecte `postgres`, le SQL affiché seulement si `config.sqlLogging`, dix connexions au plus. L'exporter.
5. Lancer `node --env-file=.env -e "require('./src/models').sequelize.authenticate().then(() => console.log('Connexion à PostgreSQL : OK')).finally(() => process.exit())"`.

Résultat attendu : `Connexion à PostgreSQL : OK`.

## Exercice 2.3-D — Les modèles de TaskFlow (10 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `src/models/user.js` : une fonction qui reçoit `sequelize` et définit `User`, avec `name` (2 à 80 caractères, obligatoire) et `email` (160 caractères au plus, obligatoire, unique, au format e-mail) ; table `users`, `underscored: true`.
2. Créer le fichier `src/models/task.js` : `Task`, avec `title` (3 à 120 caractères, obligatoire), `done` (booléen, `false` par défaut) et `dueDate` (date sans heure, facultative) ; table `tasks`, `underscored: true`, un index sur `user_id` ; un hook `beforeValidate` qui retire les espaces autour du titre.
3. Créer le fichier `src/models/tag.js` : `Tag`, avec `label` (40 caractères au plus, obligatoire, unique) ; table `tags`, `underscored: true`.
4. Dans `src/models/index.js`, charger les trois modèles avec l'instance `sequelize`, puis déclarer les associations : un utilisateur a plusieurs tâches (`userId`, alias `tasks`, suppression en cascade), une tâche a un propriétaire (alias `owner`), tâches et étiquettes se relient par la table `task_tags` (alias `tags` et `tasks`).
5. Exporter `sequelize`, `User`, `Task` et `Tag`.
6. Lancer `node --env-file=.env -e "require('./src/models').sequelize.sync({ force: true }).then(() => console.log('Tables créées')).finally(() => process.exit())"`.
7. Lancer `psql postgres://taskflow:secret@localhost:5432/taskflow -c "\dt"`.

Résultat attendu : `Tables créées`, puis quatre tables : `tags`, `task_tags`, `tasks` et `users`.

## Exercice 2.3-E — Les données de départ (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `src/scripts/seed.js`.
2. Y recréer les tables avec `sequelize.sync({ force: true })`.
3. Y créer Alice (`alice@example.org`) et Bob (`bob@example.org`), puis les étiquettes `travail` et `maison`.
4. Y créer trois tâches : « Préparer la démo » pour Alice (échéance `2026-11-02`, étiquette `travail`), « Faire les courses » pour Bob (étiquette `maison`), « Relire le cours Node.js » pour Alice, terminée.
5. Y afficher `Base initialisée :` suivi du nombre de tâches, puis fermer la connexion.
6. Ajouter à `package.json` le script `"seed": "node --env-file=.env src/scripts/seed.js"`.
7. Lancer `npm run seed`.

Résultat attendu : `Base initialisée : 3 tâches`.

## Exercice 2.3-F — Le service des utilisateurs (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `src/services/userService.js`.
2. Y écrire `toDTO(user)`, qui renvoie `id`, `name`, `email` et `createdAt`.
3. Y écrire `register({ name, email })` : dans une transaction, créer l'utilisateur puis sa tâche « Bienvenue <nom> ! », et renvoyer son DTO.
4. Y écrire `findById(id)` : le DTO de l'utilisateur, ou `null` s'il n'existe pas.
5. Y écrire `tasksOf(userId)` : en une seule requête (`include`), les tâches de l'utilisateur (`id`, `title`, `done`) triées par identifiant, ou `null` si l'utilisateur n'existe pas.
6. Exporter `register`, `findById` et `tasksOf`.
7. Lancer `node --env-file=.env -e "require('./src/services/userService').register({ name: 'Zoe', email: 'zoe@example.org' }).then(console.log).finally(() => process.exit())"`.
8. Lancer `node --env-file=.env -e "require('./src/services/userService').tasksOf(3).then(console.log).finally(() => process.exit())"`.

Résultat attendu : Zoe reçoit l'identifiant 3, et sa liste contient la tâche « Bienvenue Zoe ! ».

## Exercice 2.4-A — Premiers tests de la validation (4 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Installer Mocha : `npm install --save-dev mocha`.
2. Créer le fichier `test/validation.test.js`.
3. Y importer `node:assert/strict` et la fonction `validateTask` de `src/validation.js`.
4. Y écrire, dans un `describe('validateTask()')`, deux tests : le titre `'  Écrire  '` est accepté et nettoyé (`{ title: 'Écrire' }`) ; le titre `'ab'`, trop court, lève une erreur de statut 422.
5. Lancer `npx mocha test/validation.test.js`.

Résultat attendu : `2 passing`.

## Exercice 2.4-C — Compléter les tests de PUT (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `test/api-extra.test.js`.
2. Y écrire un test : `PUT` sans titre sur une tâche existante renvoie 422.
3. Y écrire un test : `PUT` avec un titre seulement remplace toute la tâche ; `done` retombe à `false` s'il valait `true`.
4. Lancer `npm test`.

Résultat attendu : `37 passing`.

## Exercice 2.6 — Assembler et livrer TaskFlow (40 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

**Cahier des charges.** Livrer une application TaskFlow qui respecte ces huit points :

1. API REST sur `/api/tasks` et `/api/users` : validation, pagination, erreurs JSON, statuts précis.
2. SPA dans `public/` : afficher les tâches, en ajouter, les terminer, les supprimer, afficher les erreurs de l'API ; aucune injection HTML possible.
3. Sécurité : `helmet` (la SPA fonctionne avec sa politique de sécurité de contenu par défaut), CORS limité, limitation de débit, corps JSON limité.
4. Configuration par variables d'environnement uniquement, `.env.example` fourni, aucun secret dans le dépôt.
5. Tests Mocha : au moins 30 tests, couverture de 80 % au minimum, base de test isolée.
6. `npm run start:cluster` : un worker par cœur (ou `WORKERS`), redémarrage automatique d'un worker arrêté.
7. Arrêt propre sur `SIGTERM` et `SIGINT` : fin des requêtes en cours, fermeture du pool de connexions, code de sortie 0.
8. `README.md` : prérequis, installation, commandes, variables d'environnement, schéma d'architecture.

```mermaid
flowchart LR
  SPA["public/ : SPA"] -- "GET statiques + fetch" --> APP["app.js<br/>middlewares + routes"]
  APP --> SV["services/<br/>règles métier"]
  SV --> MD["models/<br/>Sequelize"]
  MD --> PG[("PostgreSQL")]
  CL["cluster.js<br/>primaire"] -- "fork / redémarrage" --> APP
```

## Exercice 2.6-A — Vérifier chaque exigence (20 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Lancer `npm test` : au moins 30 tests, tous verts.
2. Lancer `npm run test:cov` : au moins 80 % des lignes.
3. Lancer `WORKERS=2 npm run start:cluster`, arrêter un worker, vérifier qu'il est remplacé (comme à l'étape « Vérifier l'arrêt propre et le cluster »), puis Ctrl+C.
4. Lancer `npm start`, puis `curl -I localhost:3000/api/health` : relever les en-têtes de `helmet`.
5. Vérifier que `.env` est ignoré par Git : `git check-ignore -v .env`.
6. Arrêter le serveur avec Ctrl+C : « SIGINT reçu : arrêt en cours », puis `echo $?`.
7. Vérifier dans `src/config.js` que la base de test (`taskflow_test`) est distincte de la base de développement.

Résultat attendu : chaque point du cahier des charges est vérifié par une commande ou une lecture.

## Exercice 2.6-B — Écrire le README (10 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer `README.md` à la racine.
2. Y écrire, dans cet ordre : les prérequis, l'installation, les commandes, les variables d'environnement, l'API (verbes, adresses, statuts), l'architecture.

Résultat attendu : quelqu'un qui ne connaît pas le projet l'installe et le lance en suivant le README.
