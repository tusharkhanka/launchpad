const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Environment = AppDataSource.define('environment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  organisation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'organisation', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  cloud_account_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'cloud_account', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  vpc_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.ENUM('CREATING', 'ACTIVE', 'UPDATING', 'FAILED', 'DELETING'),
    allowNull: false,
    defaultValue: 'CREATING',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'environment',
});

module.exports = Environment;

