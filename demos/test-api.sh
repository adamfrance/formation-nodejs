#!/usr/bin/env bash
# Usage : ./test-api.sh [url]   (le serveur doit tourner)
BASE=${1:-http://localhost:3000}
JSON='Content-Type: application/json'

# call : libellé, puis les arguments de curl ; affiche le corps de la réponse et le statut HTTP
call() { local label=$1; shift; printf '%-30s' "$label"; curl -s -w '  -> %{http_code}\n' "$@"; }
# code : même chose, mais sans le corps de la réponse
code() { local label=$1; shift; printf '%-30s' "$label"; curl -s -o /dev/null -w '-> %{http_code}\n' "$@"; }

call "GET /health"             "$BASE/health"
call "GET liste"               "$BASE/api/tasks"
call "POST titre valide"       -X POST "$BASE/api/tasks" -H "$JSON" -d '{"title":"Relire le rapport"}'
call "POST titre trop court"   -X POST "$BASE/api/tasks" -H "$JSON" -d '{"title":"x"}'
call "POST JSON invalide"      -X POST "$BASE/api/tasks" -H "$JSON" -d '{oups'
call "GET /api/tasks/1"        "$BASE/api/tasks/1"
call "GET identifiant invalide" "$BASE/api/tasks/abc"
call "PUT done=true"           -X PUT "$BASE/api/tasks/1" -H "$JSON" -d '{"done":true}'
call "GET filtre + limite"     "$BASE/api/tasks?done=true&limit=5"
code "DELETE /api/tasks/1"     -X DELETE "$BASE/api/tasks/1"
call "GET tâche inconnue"      "$BASE/api/tasks/999"
code "GET /../package.json"    --path-as-is "$BASE/../package.json"
code "GET /..%2Fpackage.json"  --path-as-is "$BASE/..%2Fpackage.json"
code "GET /"                   "$BASE/"
