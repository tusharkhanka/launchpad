const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Secret = AppDataSource.define('secrets', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  secret_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  current_version_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  last_version_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'secrets',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['secret_id']
    }
  ]
});

// Define associations
Secret.associate = (models) => {
  // Secret can be referenced by Tag through features.secret_id
};

module.exports = Secret;

