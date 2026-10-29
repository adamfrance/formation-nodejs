#!/usr/bin/env bash
# Exercice 2.2-8 : tester l'envoi de fichiers comme un attaquant (démo pages : node pages/server.js)
URL=${1:-http://localhost:3001}

# trois fichiers d'essai
printf '%%PDF-1.4\n%%%%EOF\n' > ok.pdf          # un petit PDF
printf 'MZ' > test.exe                          # un exécutable Windows
head -c 3145728 /dev/urandom > gros.png         # 3 Mo, au-delà de la limite de 2 Mo

# statut : affiche le code HTTP de la requête, puis le libellé du cas
statut() { curl -s -o /dev/null -w "%{http_code}  $1\n" "${@:2}"; }

statut "PDF"               -F "file=@ok.pdf;type=application/pdf" "$URL/tasks/1/attachment"
statut "exécutable"        -F "file=@test.exe;type=application/octet-stream" "$URL/tasks/1/attachment"
statut "PNG de 3 Mo"       -F "file=@gros.png;type=image/png" "$URL/tasks/1/attachment"
statut "sortir du dossier" --path-as-is "$URL/tasks/files/..%2Fapp.js"
statut "adresse inconnue"  "$URL/inconnu"

rm -f ok.pdf test.exe gros.png
