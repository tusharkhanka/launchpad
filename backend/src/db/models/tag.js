const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Tag = AppDataSource.define('tags', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'tags',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['name']
    }
  ]
});

// Define associations
Tag.associate = (models) => {
  // Tag has many ApplicationEnvironmentTagMappings
  Tag.hasMany(models.ApplicationEnvironmentTagMapping, {
    foreignKey: 'tag_id',
    as: 'applicationEnvironmentMappings'
  });
};

module.exports = Tag;

