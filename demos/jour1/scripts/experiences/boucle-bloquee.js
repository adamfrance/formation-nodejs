// Un « battement de cœur » : un point toutes les 100 ms tant que la boucle d'événements est libre
const battement = setInterval(() => process.stdout.write('.'), 100);

// Attente active : le thread JavaScript ne fait rien d'autre pendant ce temps (BLOQUANT)
function attendre(ms) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { }
}

setTimeout(() => {
  console.log('\n[début du calcul bloquant : 1 seconde]');
  attendre(1000);
  console.log('[fin du calcul : aucun point n\'a pu s\'afficher pendant ce temps]');
}, 500);

setTimeout(() => {
  clearInterval(battement);
  console.log('\nterminé');
}, 2000);
