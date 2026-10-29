// Rappels JavaScript utiles côté serveur : portée, fermeture, this, call / apply / bind

// 1. Portée : var crée UNE variable pour toute la fonction, let une variable PAR tour de boucle
for (let i = 1; i <= 3; i++) setTimeout(() => console.log('var :', i), 0);
for (let j = 1; j <= 3; j++) setTimeout(() => console.log('let :', j), 0);

// 2. Fermeture : la fonction renvoyée garde accès aux variables de la fonction qui l'a créée
function creerCompteur() {
  let total = 0;                         // variable privée, invisible de l'extérieur
  return () => ++total;                  // cette fonction « se souvient » de total
}
const suivant = creerCompteur();
console.log('compteur :', suivant(), suivant(), suivant());

// 3. this dépend de la façon dont on APPELLE la fonction, pas de l'endroit où elle est écrite
const service = {
  nom: 'TaskService',
  presenter() { return `je suis ${this?.nom}`; },
};
console.log('appel normal      :', service.presenter());           // this = service
const detachee = service.presenter.bind(service);                   // la méthode, liée à son objet
console.log('fonction détachée :', detachee());                     // this perdu
console.log('call              :', detachee.call({ nom: 'un autre objet' }));   // this imposé à l'appel
console.log('apply             :', Math.max.apply(null, [3, 9, 4]));          // arguments dans un tableau
const liee = service.presenter.bind(service);                      // nouvelle fonction, this fixé pour toujours
setTimeout(() => console.log('bind              :', liee()), 0);
