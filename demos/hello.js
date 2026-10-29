// Premier programme Node.js
const name = process.argv[2] ?? 'monde';
const env = process.env.NODE_ENV ?? 'development';

console.log(`Bonjour ${name} !`);
console.log(`Node ${process.version} sur ${process.platform}`);
console.log(`Environnement : ${env}`);
