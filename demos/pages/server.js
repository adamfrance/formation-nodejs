// Démo des pages rendues par le serveur : depuis demos, node pages/server.js
const app = require('./app');

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`Démo pages sur http://localhost:${port}`));
