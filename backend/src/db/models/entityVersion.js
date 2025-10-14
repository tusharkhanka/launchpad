const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const EntityVersion = AppDataSource.define('entity_version', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false
  },
  from_version: {
    type: DataTypes.STRING,
    allowNull: true
  },
  operation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'entity_versions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      fields: ['entity_type', 'entity_id', 'version']
    },
    {
      fields: ['entity_type']
    },
    {
      fields: ['entity_id']
    }
  ]
});

// Define associations
EntityVersion.associate = (models) => {
  // EntityVersion can belong to different entity types
  // Associations will be defined based on entity_type
};

module.exports = EntityVersion;
