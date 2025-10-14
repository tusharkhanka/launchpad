const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const CloudAccount = AppDataSource.define('cloud_account', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['aws', 'gcp', 'azure', 'oracle']],
    },
  },
  account_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  account_identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  organisation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'organisation', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  access_keys: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('access_keys must be an array');
        }
      },
    },
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'cloud_account',
  indexes: [
    {
      fields: ['organisation_id'],
    },
    {
      fields: ['provider'],
    },
    {
      fields: ['account_identifier'],
    },
  ],
});

// Define associations
CloudAccount.associate = (models) => {
  // CloudAccount belongs to Organisation
  CloudAccount.belongsTo(models.Organisation, {
    foreignKey: 'organisation_id',
    as: 'organisation'
  });

  // CloudAccount has many Environments
  CloudAccount.hasMany(models.Environment, {
    foreignKey: 'cloud_account_id',
    as: 'environments'
  });
};

module.exports = CloudAccount;
