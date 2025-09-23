const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Organisation = AppDataSource.define('organisation', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'organisation',
});

module.exports = Organisation;

