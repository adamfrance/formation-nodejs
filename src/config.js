const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  isTest,
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: isTest
    ? (process.env.DATABASE_URL_TEST ?? 'postgres://taskflow:secret@localhost:5432/taskflow_test')
    : (process.env.DATABASE_URL ?? 'postgres://taskflow:secret@localhost:5432/taskflow'),
  sqlLogging: process.env.SQL_LOG === '1',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
};
