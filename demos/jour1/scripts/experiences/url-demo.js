// Analyser l'URL d'une requête : chemin et paramètres
const url = new URL('/api/tasks?done=true&page=2&tag=a&tag=b', 'http://localhost:3000');

console.log('pathname :', url.pathname);
console.log('done     :', url.searchParams.get('done'), '(type', typeof url.searchParams.get('done') + ')');
console.log('tag (x2) :', url.searchParams.getAll('tag'));
console.log('objet    :', Object.fromEntries(url.searchParams));
console.log('absent   :', url.searchParams.get('inconnu'));
