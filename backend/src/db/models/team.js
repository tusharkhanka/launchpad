const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');

const Team = AppDataSource.define('teams', {
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'teams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Team.associate = function(models) {
  Team.hasMany(models.UserTeamRoleMapping, {
    foreignKey: 'team_id',
    as: 'userTeamRoleMappings'
  });
};

module.exports = Team;
