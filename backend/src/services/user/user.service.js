const userProvider = require('../../dataProviders/userProvider'); 

const UserService = {};

UserService.getAllUsers = async()=> {
    const response = await userProvider.findAll();
    return response;
}

UserService.getById = async(userId)=> {
    const response = await userProvider.findOneById(userId);
    return response;
}

UserService.getUserTeamsAndRoles = async(userId) => {
    try {
        const { UserTeamRoleMapping, Team, Role } = require('../../db/models');
        
        const userTeamRoles = await UserTeamRoleMapping.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Team,
                    as: 'team',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });

        return userTeamRoles.map(mapping => ({
            team_id: mapping.team_id,
            team_name: mapping.team?.name,
            team_email: mapping.team?.email,
            role_id: mapping.role_id,
            role_name: mapping.role?.name,
            joined_at: mapping.created_at
        }));
    } catch (error) {
        console.error('Error getting user teams and roles:', error);
        throw error;
    }
}

UserService.getUsersByEmail = async(searchTerm) => {
    try {
        const { Test } = require('../../db/models');
        
        const users = await Test.findAll({
            where: {
                email: {
                    [require('sequelize').Op.like]: `%${searchTerm}%`
                }
            },
            attributes: ['id', 'username', 'email'],
            limit: 10
        });

        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email
        }));
    } catch (error) {
        console.error('Error searching users by email:', error);
        throw error;
    }
}

module.exports = UserService;