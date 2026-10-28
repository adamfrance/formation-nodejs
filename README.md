# Formation Node.js — programmation JavaScript côté serveur

Réf. NJS-SPE · 2 jours · fil rouge **TaskFlow** (API de gestion de tâches, application web, tests).

## Ce que contient ce dépôt

| Dossier | Contenu | Quand |
|---|---|---|
| `depart/jour1`, `depart/jour2` | Les fichiers de départ à ne pas retaper (données, petits scripts fournis, CSS) | Dès le début |
| `supports/` | Le support de chaque journée (`formation-nodejs-jour1-apprenant.html`, puis `formation-nodejs-jour2-apprenant.html` et `formation-nodejs-support-complet-apprenant.html`, les deux jours + mémento) et les énoncés des exercices (`enonces/`) | En fin de chaque journée |
| `jour1/` | Le code de fin du jour 1 (corrigés) | Le soir du jour 1 |
| `jour2/` | Le code de fin du jour 2 (corrigés) | Le soir du jour 2 |
| `base-tp-2.6/` | Le projet au début du TP 2.6, pour qui n'a pas terminé la journée | Le jour 2 vers 16 h 25, si besoin |

## Utilisation

Sous Windows, toutes les commandes se tapent dans **Git Bash** (installé avec Git for Windows ; dans VS Code : Terminal > Nouveau terminal > Git Bash).

```bash
mkdir -p ~/projets && cd ~/projets
git clone https://github.com/adamfrance/formation-nodejs.git
```

Pendant la journée, le formateur colle dans le chat de la visio le code à copier et les énoncés des exercices. Le support de la journée (tout le code, avec un bouton **Copier** sur chaque bloc) est ajouté à ce dépôt en fin de journée : après `git pull`, ouvrez-le dans votre navigateur depuis votre copie locale (double-clic sur le fichier), car GitHub n'affiche pas ces pages HTML en ligne.

On ne travaille pas dans ce dossier : vos projets se créent à côté, dans `~/projets/jour1/` et `~/projets/jour2/` (le cours indique chaque commande).

Pour récupérer ce que le formateur ajoute (support et code de fin de journée, corrections) :

```bash
git -C ~/projets/formation-nodejs pull
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
