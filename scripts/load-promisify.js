// Variante : util.promisify sur la version à callbacks
const { promisify } = require('node:util');
const { loadTasks: loadTasksCb } = require('./callbacks');

module.exports = { loadTasks: promisify(loadTasksCb) };
