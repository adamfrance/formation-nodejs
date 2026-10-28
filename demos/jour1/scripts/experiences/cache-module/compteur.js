// Ce code ne s'exécute qu'UNE fois, au premier require
console.log('compteur.js : chargé');

let valeur = 0;

module.exports = { incrementer: () => ++valeur };
