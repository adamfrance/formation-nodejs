// Rappels JavaScript utiles côté serveur : portée, fermeture, this, call / apply / bind

// 1. Portée : var crée UNE variable pour toute la fonction, let une variable PAR tour de boucle
for (var i = 1; i <= 3; i++) setTimeout(() => console.log('var :', i), 0);
for (let j = 1; j <= 3; j++) setTimeout(() => console.log('let :', j), 0);

// 2. Fermeture : la fonction renvoyée garde accès aux variables de la fonction qui l'a créée
function creerCompteur() {
  let total = 0;
  return () => ++total;
}
const suivant = creerCompteur();
console.log('compteur :', suivant(), suivant(), suivant());

// 3. this dépend de la façon dont on APPELLE la fonction, pas de l'endroit où elle est écrite
const service = {
  nom: 'TaskService',
  presenter() { return `je suis ${this?.nom}`; },
};
console.log('appel normal      :', service.presenter());
const detachee = service.presenter;
console.log('fonction détachée :', detachee());
console.log('call              :', detachee.call({ nom: 'un autre objet' }));
console.log('apply             :', Math.max.apply(null, [3, 9, 4]));
const liee = service.presenter.bind(service);
setTimeout(() => console.log('bind              :', liee()), 0);
