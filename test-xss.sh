#!/usr/bin/env bash
# Exercice 2.2-6 : un titre piégé s'affiche-t-il comme du texte ? (démo pages : node pages/server.js)
URL=${1:-http://localhost:3001}

curl -s -o /dev/null --data-urlencode "title=<script>alert(1)</script>" "$URL/tasks"
curl -s "$URL/tasks" | grep -o '<span>.*alert.*</span>'
