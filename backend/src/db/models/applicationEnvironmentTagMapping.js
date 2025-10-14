const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const ApplicationEnvironmentTagMapping = AppDataSource.define('application_environment_tag_mapping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'applications',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  tag_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  environment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'environments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
}, {
  tableName: 'application_environment_tag_mapping',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['application_id']
    },
    {
      fields: ['tag_id']
    },
    {
      fields: ['environment_id']
    },
    {
      fields: ['application_id', 'tag_id', 'environment_id'],
      unique: true
    }
  ]
});

// Define associations
ApplicationEnvironmentTagMapping.associate = (models) => {
  // ApplicationEnvironmentTagMapping belongs to Application
  ApplicationEnvironmentTagMapping.belongsTo(models.Application, {
    foreignKey: 'application_id',
    as: 'application'
  });

  // ApplicationEnvironmentTagMapping belongs to Tag
  ApplicationEnvironmentTagMapping.belongsTo(models.Tag, {
    foreignKey: 'tag_id',
    as: 'tag'
  });

  // ApplicationEnvironmentTagMapping belongs to Environment
  ApplicationEnvironmentTagMapping.belongsTo(models.Environment, {
    foreignKey: 'environment_id',
    as: 'environment'
  });
};

module.exports = ApplicationEnvironmentTagMapping;
