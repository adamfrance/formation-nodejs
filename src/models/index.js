const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.sqlLogging ? console.log : false,
  pool: { max: 10, idle: 10_000 },
});

const User = require('./user')(sequelize);
const Task = require('./task')(sequelize);
const Tag = require('./tag')(sequelize);

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Task.belongsToMany(Tag, { through: 'task_tags', as: 'tags' });
Tag.belongsToMany(Task, { through: 'task_tags', as: 'tasks' });

module.exports = { sequelize, User, Task, Tag };
