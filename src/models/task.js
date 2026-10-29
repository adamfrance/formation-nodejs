const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING(120), allowNull: false, validate: { len: [3, 120] } },
    done: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    dueDate: { type: DataTypes.DATEONLY },
  }, { tableName: 'tasks', underscored: true, indexes: [{ fields: ['user_id'] }] });

  Task.beforeValidate((task) => {
    if (typeof task.title === 'string') task.title = task.title.trim();
  });
  return Task;
};
