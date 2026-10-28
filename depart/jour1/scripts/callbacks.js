const fs = require('node:fs');

function loadTasks(file, callback) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return callback(err);
    try {
      callback(null, JSON.parse(data));
    } catch (parseError) {
      callback(parseError);
    }
  });
}

module.exports = { loadTasks };
