const express = require('express');
const path = require('node:path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.disable('x-powered-by');

if (!config.isTest) app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', pid: process.pid, uptime: process.uptime() }));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api', notFound);                                // 404 JSON pour l'API

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
