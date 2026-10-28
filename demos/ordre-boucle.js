// L'ordre d'exécution ne dépend pas de l'ordre d'écriture
setTimeout(() => console.log('4. setTimeout : une phase de la boucle'), 0);
Promise.resolve().then(() => console.log('3. then : une microtâche'));
process.nextTick(() => console.log('2. nextTick : dès que le code synchrone est fini'));
console.log('1. code synchrone');
