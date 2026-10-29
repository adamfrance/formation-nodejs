# TaskFlow

API REST de gestion de tâches (Express 5, Sequelize, PostgreSQL) avec une application web monopage (SPA), des tests Mocha et un mode cluster.

## Prérequis

- Node.js 22 LTS ou plus
- PostgreSQL 15 ou plus (voir Docker ci-dessous)

## Installation

```bash
npm install
cp .env.example .env            # puis adapter les valeurs
docker run --name taskflow-db -d -p 5432:5432 \
  -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=taskflow postgres:16
docker exec taskflow-db createdb -U taskflow taskflow_test
npm run seed                    # schéma + données de démonstration (efface la base !)
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm start` | Serveur sur le port `PORT` (3000 par défaut) |
| `npm run dev` | Serveur avec redémarrage automatique (`--watch`) |
| `npm run start:cluster` | Un worker par cœur (variable `WORKERS`) |
| `npm run seed` | Recrée le schéma et insère des données |
| `npm test` | Tests Mocha sur la base `taskflow_test` |
| `npm run test:cov` | Tests + couverture (seuil 80 %) |

## Variables d'environnement

| Variable | Défaut | Rôle |
|---|---|---|
| `PORT` | 3000 | Port d'écoute |
| `DATABASE_URL` | `postgres://taskflow:secret@localhost:5432/taskflow` | Base de l'application |
| `DATABASE_URL_TEST` | `postgres://taskflow:secret@localhost:5432/taskflow_test` | Base des tests |
| `CORS_ORIGIN` | `http://localhost:3000` | Origine autorisée par CORS |
| `WORKERS` | nombre de cœurs | Workers du mode cluster |
| `SQL_LOG` | (vide) | `1` pour journaliser le SQL |

## API

| Verbe | URL | Statuts |
|---|---|---|
| GET | `/api/tasks?done=&q=&page=&limit=` | 200, 400 |
| POST | `/api/tasks` | 201, 400, 409, 422 |
| GET / PUT / PATCH / DELETE | `/api/tasks/:id` | 200, 204, 400, 404, 422 |
| POST | `/api/users` | 201, 409, 422 |
| GET | `/api/users/:id`, `/api/users/:id/tasks` | 200, 404 |
| GET | `/api/health` | 200 |

## Architecture

```mermaid
flowchart LR
  SPA["SPA (public/)"] --> APP["app.js : middlewares + routes"]
  APP --> SVC["services/"]
  SVC --> MOD["models/ (Sequelize)"]
  MOD --> PG[("PostgreSQL")]
```

En production, utiliser des migrations (`sequelize-cli`) plutôt que `sequelize.sync()`.
