const teamProvider = require('../../dataProviders/teamProvider');
const { UserTeamRoleMapping, Role, Test } = require('../../db/models');

const TeamService = {
  create: async ({ name, email }) => {
    // Check if team with same email already exists
    const existingTeam = await teamProvider.findByEmail(email);
    if (existingTeam) {
      throw new Error('Team with this email already exists');
    }

    // Check if team with same name already exists
    const existingTeamByName = await teamProvider.findByName(name);
    if (existingTeamByName) {
      throw new Error('Team with this name already exists');
    }

    const created = await teamProvider.create({ name, email });
    return created.get({ plain: true });
  },

  getById: async (id) => {
    const team = await teamProvider.findById(id);
    if (!team) {
      throw new Error('Team not found');
    }
    return team.get({ plain: true });
  },

  list: async () => {
    const teams = await teamProvider.findAll();
    return teams.map(team => team.get({ plain: true }));
  },

  update: async (id, { name, email }) => {
    // Check if team exists
    const existingTeam = await teamProvider.findById(id);
    if (!existingTeam) {
      throw new Error('Team not found');
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== existingTeam.email) {
      const teamWithEmail = await teamProvider.findByEmail(email);
      if (teamWithEmail) {
        throw new Error('Team with this email already exists');
      }
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existingTeam.name) {
      const teamWithName = await teamProvider.findByName(name);
      if (teamWithName) {
        throw new Error('Team with this name already exists');
      }
    }

    const affected = await teamProvider.updateById(id, { name, email });
    if (!affected) {
      throw new Error('Failed to update team');
    }
    
    return teamProvider.findById(id);
  },

  remove: async (id) => {
    // Check if team exists
    const existingTeam = await teamProvider.findById(id);
    if (!existingTeam) {
      throw new Error('Team not found');
    }

    const deleted = await teamProvider.deleteById(id);
    if (!deleted) {
      throw new Error('Failed to delete team');
    }
    
    return { success: true, message: 'Team deleted successfully' };
  },

  getTeamMembers: async (teamId) => {
    try {
      const team = await teamProvider.findById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const members = await UserTeamRoleMapping.findAll({
        where: { team_id: teamId },
        include: [
          {
            model: Test,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name']
          }
        ]
      });

      return members.map(member => ({
        id: member.id,
        user_id: member.user_id,
        username: member.user?.username,
        email: member.user?.email,
        role: member.role?.name,
        role_id: member.role_id,
        status: 'active', // You can add status logic here
        created_at: member.created_at
      }));
    } catch (error) {
      throw error;
    }
  },

  addMemberToTeam: async (teamId, { userId, roleId }) => {
    try {
      const team = await teamProvider.findById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const user = await Test.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        throw new Error('Role not found');
      }

      // Check if user is already in the team
      const existingMapping = await UserTeamRoleMapping.findOne({
        where: {
          user_id: userId,
          team_id: teamId
        }
      });

      if (existingMapping) {
        throw new Error('User is already a member of this team');
      }

      // Add user to team
      const mapping = await UserTeamRoleMapping.create({
        user_id: userId,
        team_id: teamId,
        role_id: roleId
      });

      return mapping;
    } catch (error) {
      throw error;
    }
  },

  removeMemberFromTeam: async (teamId, userId) => {
    try {
      const deleted = await UserTeamRoleMapping.destroy({
        where: {
          team_id: teamId,
          user_id: userId
        }
      });

      if (!deleted) {
        throw new Error('Member not found in team');
      }

      return { success: true, message: 'Member removed from team successfully' };
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email) => {
    const team = await teamProvider.findByEmail(email);
    return team ? team.get({ plain: true }) : null;
  }
};

module.exports = TeamService;
