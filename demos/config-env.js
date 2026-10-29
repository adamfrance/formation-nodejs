// 12 facteurs : la configuration vient de l'environnement, avec des valeurs par défaut
const config = {
  port: Number(process.env.PORT ?? 3000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  production: process.env.NODE_ENV === 'production',
};

console.log(config);
