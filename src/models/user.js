const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  name: { type: DataTypes.STRING(80), allowNull: false, validate: { len: [2, 80] } },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
}, { tableName: 'users', underscored: true });
