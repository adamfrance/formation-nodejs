const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Tag', {
  label: { type: DataTypes.STRING(40), allowNull: false, unique: true },
}, { tableName: 'tags', underscored: true });
