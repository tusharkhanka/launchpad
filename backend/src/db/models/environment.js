const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Environment = AppDataSource.define('environments', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  cloud_account_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'cloud_account',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  vpc_id: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  org_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organisation',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'environments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['cloud_account_id']
    },
    {
      fields: ['org_id']
    },
    {
      fields: ['name', 'org_id'],
      unique: true
    }
  ]
});

// Define associations
Environment.associate = (models) => {
  // Environment belongs to CloudAccount
  Environment.belongsTo(models.CloudAccount, {
    foreignKey: 'cloud_account_id',
    as: 'cloudAccount'
  });

  // Environment belongs to Organisation
  Environment.belongsTo(models.Organisation, {
    foreignKey: 'org_id',
    as: 'organisation'
  });

  // Environment has many ApplicationEnvironmentTagMappings
  Environment.hasMany(models.ApplicationEnvironmentTagMapping, {
    foreignKey: 'environment_id',
    as: 'applicationTagMappings'
  });
};

module.exports = Environment;
