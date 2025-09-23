const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const CloudAccount = AppDataSource.define('cloud_account', {
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  provider: {
    type: DataTypes.ENUM('aws', 'gcp', 'azure', 'oracle'),
    allowNull: false,
  },
  account_identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  access_role: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'cloud_account',
});

module.exports = CloudAccount;

