const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const UserTeamRoleMapping = AppDataSource.define('user_team_role_mapping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Test',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
}, {
  tableName: 'user_team_role_mapping',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

UserTeamRoleMapping.associate = function(models) {
  UserTeamRoleMapping.belongsTo(models.Team, {
    foreignKey: 'team_id',
    as: 'team'
  });
  
  UserTeamRoleMapping.belongsTo(models.Role, {
    foreignKey: 'role_id',
    as: 'role'
  });

  UserTeamRoleMapping.belongsTo(models.Test, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = UserTeamRoleMapping;
