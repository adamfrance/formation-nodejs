# Énoncés des exercices — Jour 1

Formation « Node.js, programmation JavaScript côté serveur » — Réf. NJS-SPE. Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 1.0 — Corriger la boucle et this (5 min)

Dossier : `~/projets/formation-nodejs/taskflow` (créé à la consigne 1).

1. Créer le dossier et y entrer : `mkdir -p ~/projets/formation-nodejs/taskflow/scripts && cd ~/projets/formation-nodejs/taskflow`.
2. Copier l'exemple : `cp ../demos/rappels-js.js scripts/`.
3. Dans `scripts/rappels-js.js`, changer **un seul mot** pour que la boucle `var` affiche 1, 2, 3.
4. Changer **une seule ligne** pour que la ligne `fonction détachée` affiche `je suis TaskService`.
5. Lancer `node scripts/rappels-js.js`.

Résultat attendu : `var : 1`, `var : 2`, `var : 3` et `fonction détachée : je suis TaskService`.

## Exercice 1.1-A — Le premier module de TaskFlow (5 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le dossier `src` et le fichier `src/tasks.js`.
2. Y déclarer un tableau `tasks` vide et un compteur `nextId` qui part de 1, sans les exporter.
3. Y écrire `add(title)` : crée `{ id, title, done: false }` avec l'identifiant suivant, l'ajoute au tableau et la renvoie.
4. Y écrire `list()` : renvoie une copie du tableau.
5. Ajouter deux tâches au chargement du module : « Installer Node.js » et « Écrire mon premier serveur ».
6. Exporter `add` et `list` avec `module.exports`.
7. Lancer `node -p "require('./src/tasks').list()"`.

Résultat attendu : les deux tâches, avec les identifiants 1 et 2 et `done: false`.

## Exercice 1.1-B — Ajouter GET /health (10 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Ouvrir `src/server.js`.
2. Importer `dayjs` en haut du fichier.
3. Ajouter une route `GET /health` qui répond 200 en JSON avec trois champs : `status` (la chaîne `ok`), `node` (`process.version`) et `time` (l'heure actuelle, `dayjs().format('YYYY-MM-DD HH:mm:ss')`).
4. Relancer le serveur : Ctrl+C, puis `npm start`.
5. Tester : `curl -s localhost:3000/health`, `curl -s localhost:3000/tasks`, `curl -i localhost:3000/inconnu`.

Résultat attendu : `/health` et `/tasks` répondent en JSON ; l'URL inconnue répond 404, avec `Content-Type: application/json; charset=utf-8`.

## Exercice 1.1-C — Contrôler son projet (3 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Lancer `git status --short`.
2. Vérifier que `node_modules/` n'apparaît pas dans la liste.
3. Lancer `npm audit`.

Résultat attendu : `git status` liste les fichiers du projet, sans `node_modules/` ; `npm audit` affiche `found 0 vulnerabilities`.

## Exercice 1.2-0 — Bloquer TaskFlow (4 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Ouvrir le fichier `src/server.js`.
2. Y ajouter, avant la réponse 404, une route `GET /lent` : une boucle `while` de 3 secondes (comme `attendre` dans `boucle-bloquee.js`), puis la réponse `sendJson(res, 200, { fini: true })`.
3. Lancer le serveur dans le terminal 1 : `npm run dev`.
4. Dans le terminal 2, appeler `/lent`, puis `/health` une seconde plus tard : `curl -w '\n' localhost:3000/lent & sleep 1; time curl -w '\n' localhost:3000/health`.
5. Supprimer la route `/lent`.

Résultat attendu (étape 4) : `/health` répond au bout de 2 secondes environ (ligne `real`) au lieu de quelques millisecondes ; pendant la boucle, TaskFlow ne traite aucune requête.

## Exercice 1.2-A — Prédire l'ordre d'affichage (8 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `scripts/ordre.js`.
2. Y coller le code ci-dessous.
3. Sans l'exécuter, écrire dans le chat l'ordre des lettres affichées, avec une phrase de justification par lettre.
4. Lancer `node scripts/ordre.js` et comparer.

Fichier `taskflow/scripts/ordre.js` :

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
setImmediate(() => console.log('C'));
Promise.resolve().then(() => console.log('D'));
process.nextTick(() => console.log('E'));
(async () => {
  console.log('F');
  await null;
  console.log('G');
})();
console.log('H');
```

Résultat attendu : l'ordre des huit lettres justifié, et la raison pour laquelle B et C peuvent s'inverser d'un poste à l'autre.

## Exercice 1.2-B — Du callback à async/await (12 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `scripts/load-tasks.js`.
2. Y écrire la fonction `loadTasks(file = 'data/tasks.json')` avec `fs/promises` et `async`/`await`. Elle renvoie les tâches du fichier. Si le fichier n'existe pas (erreur `ENOENT`), elle renvoie un tableau vide. Toute autre erreur (JSON invalide, droits) est relancée.
3. Copier le fichier fourni `callbacks.js` des démos : `cp ../demos/callbacks.js scripts/`.
4. Créer le fichier `scripts/load-promisify.js`. Y exporter une version à promesse de la fonction `loadTasks` de `scripts/callbacks.js`, avec `util.promisify`, sans modifier `callbacks.js`.
5. Créer le fichier `scripts/essai-load.js`. Y essayer les deux versions sur trois cas : fichier présent, fichier absent, fichier contenant `{oups`. Afficher le résultat de chaque cas.
6. Lancer `node scripts/essai-load.js`.

## Exercice 1.2-C — Le journal d'activité (12 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Copier le service des démos dans le projet : `cp ../demos/task-service.js scripts/`.
2. Créer le fichier `scripts/activity-logger.js`.
3. Y écrire la fonction `attachLogger(service)` : pour chacun des événements `created`, `completed` et `removed`, ajouter une ligne dans `scripts/activity.log` avec `fs/promises` (date ISO, événement, `#id`, titre).
4. Y écouter aussi `error` et afficher le message avec `console.error`.
5. Exporter `attachLogger`.
6. Créer le fichier `scripts/demo.js`.
7. Y créer un `TaskService` et lui brancher `attachLogger`.
8. Y afficher un message pour la première tâche créée seulement, avec `once`.
9. Y créer deux tâches et une tâche au titre vide, puis terminer la première et supprimer la deuxième.
10. Y afficher `service.list()` et le résultat de `loadTasks('data/absent.json')` (exercice 1.2-B).
11. Lancer `node scripts/demo.js`, puis `cat scripts/activity.log`.

Résultat attendu : le titre vide affiche une erreur sans arrêter le programme, une seule tâche reste, et le journal contient quatre lignes : `created`, `created`, `completed`, `removed`.

## Exercice 1.3-A — Les statistiques des tâches (4 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le fichier `scripts/stats.js`.
2. Y définir `FILE`, le chemin de `data/tasks.json` : `path.join(__dirname, '..', 'data', 'tasks.json')`.
3. Y écrire `readTasks(file = FILE)` avec `fs/promises` : elle renvoie les tâches du fichier ; si le fichier n'existe pas (`ENOENT`), elle crée le dossier, écrit `[]` dans le fichier et renvoie `[]`.
4. Y écrire `computeStats(tasks)`, qui renvoie `{ total, done, todo }`.
5. Exporter `readTasks`, `computeStats` et `FILE`.
6. Si le fichier est lancé directement (`require.main === module`), afficher les statistiques avec `console.table`.
7. Lancer `node scripts/stats.js`.
8. Le relancer depuis `scripts/` : `cd scripts && node stats.js && cd ..`.

Résultat attendu : deux fois le même tableau, avec `total` 3, `done` 1 et `todo` 2.

## Exercice 1.3-B — Archiver le journal (3 min)

Dossier : `~/projets/formation-nodejs/taskflow`.

1. Créer le journal : `node ../demos/gen-log.js` (il écrit `server.log` dans `taskflow`).
2. Créer le fichier `scripts/archive-log.js`.
3. Y écrire `archive(source = 'server.log')`, qui compresse `source` dans `source + '.gz'` avec `pipeline(fs.createReadStream(…), zlib.createGzip(), fs.createWriteStream(…))` ; `pipeline` vient de `node:stream/promises`.
4. Afficher la taille avant et après (`fs.statSync(…).size`) et la durée.
5. En cas d'erreur, afficher « Archivage échoué » et terminer avec le code de sortie 1.
6. Lancer `node scripts/archive-log.js`.

Résultat attendu : `server.log` (environ 11 Mo) compressé en `server.log.gz` d'environ 530 Ko.
