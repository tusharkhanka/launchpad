const { Team, Role } = require('../src/db/models');

const setupDefaultData = async () => {
  try {
    console.log('Setting up default data...');

    // Create default roles
    const defaultRoles = [
      { name: 'Member' },
      { name: 'Manager' },
      { name: 'Admin' }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ where: { name: roleData.name } });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }

    // Create default team
    const defaultTeam = {
      name: 'Team Launchpad',
      email: 'team@launchpad.com'
    };

    const existingTeam = await Team.findOne({ where: { name: defaultTeam.name } });
    if (!existingTeam) {
      await Team.create(defaultTeam);
      console.log(`Created team: ${defaultTeam.name}`);
    } else {
      console.log(`Team already exists: ${defaultTeam.name}`);
    }

    console.log('Default data setup completed!');
  } catch (error) {
    console.error('Error setting up default data:', error);
    throw error;
  }
};

module.exports = setupDefaultData;

