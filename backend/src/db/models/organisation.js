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

// Define associations
Organisation.associate = (models) => {
  // Organisation has many CloudAccounts
  Organisation.hasMany(models.CloudAccount, {
    foreignKey: 'organisation_id',
    as: 'cloudAccounts'
  });

  // Organisation has many Environments
  Organisation.hasMany(models.Environment, {
    foreignKey: 'org_id',
    as: 'environments'
  });

  // Organisation has many Applications
  Organisation.hasMany(models.Application, {
    foreignKey: 'organisation_id',
    as: 'applications'
  });
};

module.exports = Organisation;

