# Formation Node.js — programmation JavaScript côté serveur

Réf. NJS-SPE · 2 jours · fil rouge **TaskFlow** (API de gestion de tâches, application web, tests).

## Deux dossiers

```text
~/projets/formation-nodejs/
├── demos/      les exemples : on les ouvre et on les lance pendant les exemples guidés
└── taskflow/   votre application TaskFlow : les exercices se font ici
```

`demos/` vient de ce dépôt. `taskflow/` est votre projet : vous le créez au TP 1.1, dans ce dossier ; Git l'ignore ici (il a son propre dépôt Git).

Le reste arrive en fin de journée, sur des branches de ce dépôt :

| Branche | Contenu |
|---|---|
| `supports` | le support de chaque journée (`formation-nodejs-jour1-apprenant.html`, puis celui du jour 2 et le support complet) et les énoncés des exercices (`enonces/`) |
| `jour-1` | TaskFlow à la fin du jour 1 |
| `jour-2-etape-nodejs` | TaskFlow au jour 2, juste avant Express : l'application 100 % Node.js (API sans framework et page web) |
| `jour-2` | TaskFlow à la fin du jour 2, avec Express |
| `debut-tp-2.6` | le point de départ du TP 2.6 |

## Utilisation

Sous Windows, toutes les commandes se tapent dans **Git Bash** (installé avec Git for Windows ; dans VS Code : Terminal > Nouveau terminal > Git Bash).

```bash
mkdir -p ~/projets && cd ~/projets
git clone https://github.com/adamfrance/formation-nodejs.git
```

Pendant la journée, le formateur colle dans le chat de la visio le code à copier et les énoncés des exercices. Le support de la journée (tout le code, avec un bouton **Copier** sur chaque bloc) et TaskFlow à la fin de la journée arrivent en fin de journée, sur les branches `supports` et `jour-N`. Pour les récupérer à côté de `demos/` (Git les ignore ici) :

```bash
cd ~/projets/formation-nodejs
git clone -b supports https://github.com/adamfrance/formation-nodejs.git supports
git clone -b jour-1 https://github.com/adamfrance/formation-nodejs.git corrige-jour1
```

Le jour 2 a deux étapes : TaskFlow 100 % Node.js, juste avant le passage à Express, puis TaskFlow fini, avec Express :

```bash
cd ~/projets/formation-nodejs
git clone -b jour-2-etape-nodejs https://github.com/adamfrance/formation-nodejs.git corrige-jour2-nodejs
git clone -b jour-2 https://github.com/adamfrance/formation-nodejs.git corrige-jour2
```

La version 100 % Node.js se lance avec `cd corrige-jour2-nodejs && npm install && npm start`, puis `http://localhost:3000` dans le navigateur. La version avec Express a son propre `README.md` (base PostgreSQL, fichier `.env`).

Le lendemain, `git -C ~/projets/formation-nodejs/supports pull` ajoute le support suivant. Ouvrez les pages HTML dans votre navigateur (double-clic sur le fichier) : GitHub ne les affiche pas en ligne.

Pour récupérer ce que le formateur ajoute :

```bash
git -C ~/projets/formation-nodejs pull
```

On ne modifie pas les fichiers de `demos/` : sinon `git pull` refuse de les mettre à jour. Pour les remettre dans leur état d'origine :

```bash
git -C ~/projets/formation-nodejs restore demos
```

Le matin du jour 2, une seule fois, on installe ce dont les exemples du jour 2 ont besoin (Express, EJS, Multer, pg, Sequelize, async, Mocha) :

```bash
cd ~/projets/formation-nodejs/demos && npm install
```

## Prérequis

- [Node.js](https://nodejs.org/) 22 ou 24 (version LTS, installeur Windows).
- [Git for Windows](https://git-scm.com/), qui installe aussi Git Bash.
- [Visual Studio Code](https://code.visualstudio.com/).
- Pour le jour 2 : PostgreSQL 17 ou plus, avec l'[installeur Windows](https://www.postgresql.org/download/windows/). Gardez le port 5432 et donnez au superutilisateur `postgres` le mot de passe `postgres`. Puis, dans Git Bash :

```bash
echo 'export PATH="$PATH:$(ls -d /c/Program\ Files/PostgreSQL/*/bin | tail -1)"' >> ~/.bashrc
source ~/.bashrc
psql postgres://postgres:postgres@localhost:5432/postgres -c "CREATE ROLE taskflow LOGIN PASSWORD 'secret' CREATEDB"
psql postgres://postgres:postgres@localhost:5432/postgres -c "CREATE DATABASE taskflow OWNER taskflow"
psql postgres://taskflow:secret@localhost:5432/taskflow -c "select version();"
```

Si la dernière commande affiche la version du serveur, c'est prêt. Au lancement suivant, Git Bash affiche une fois « WARNING: Found ~/.bashrc but no ~/.bash_profile » et crée lui-même `~/.bash_profile` : c'est normal.

En secours, si Docker Desktop est installé, une seule commande remplace l'installation de PostgreSQL :

```bash
docker run --name taskflow-db -d -p 5432:5432 -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=taskflow postgres:16
```
