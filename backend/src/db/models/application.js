const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Application = AppDataSource.define('applications', {
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
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  organisation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organisation',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
}, {
  tableName: 'applications',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['organisation_id']
    },
    {
      fields: ['name', 'organisation_id'],
      unique: true
    }
  ]
});

// Define associations
Application.associate = (models) => {
  // Application belongs to Organisation
  Application.belongsTo(models.Organisation, {
    foreignKey: 'organisation_id',
    as: 'organisation'
  });

  // Application has many ApplicationEnvironmentTagMappings
  Application.hasMany(models.ApplicationEnvironmentTagMapping, {
    foreignKey: 'application_id',
    as: 'environmentTagMappings'
  });
};

module.exports = Application;

