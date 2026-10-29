#!/usr/bin/env bash
# Exercice 2.2-7 : Post / Redirect / Get et validation côté serveur (démo pages : node pages/server.js)
URL=${1:-http://localhost:3001}

curl -s -o /dev/null -w "%{http_code}  titre trop court\n" -d "title=ab" "$URL/tasks"
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}  titre valide\n" -d "title=Planifier la revue" "$URL/tasks"
