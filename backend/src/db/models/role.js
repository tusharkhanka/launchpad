const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Role = AppDataSource.define('roles', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Role.associate = function(models) {
  Role.hasMany(models.UserTeamRoleMapping, {
    foreignKey: 'role_id',
    as: 'userTeamRoleMappings'
  });
};

module.exports = Role;
