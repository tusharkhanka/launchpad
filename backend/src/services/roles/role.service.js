const roleProvider = require('../../dataProviders/roleProvider');

const RoleService = {
  create: async ({ name }) => {
    // Check if role with same name already exists
    const existingRole = await roleProvider.findByName(name);
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    const created = await roleProvider.create({ name });
    return created.get({ plain: true });
  },

  getById: async (id) => {
    const role = await roleProvider.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role.get({ plain: true });
  },

  list: async () => {
    const roles = await roleProvider.findAll();
    return roles.map(role => role.get({ plain: true }));
  },

  update: async (id, { name }) => {
    // Check if role exists
    const existingRole = await roleProvider.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existingRole.name) {
      const roleWithName = await roleProvider.findByName(name);
      if (roleWithName) {
        throw new Error('Role with this name already exists');
      }
    }

    const affected = await roleProvider.updateById(id, { name });
    if (!affected) {
      throw new Error('Failed to update role');
    }
    
    return roleProvider.findById(id);
  },

  remove: async (id) => {
    // Check if role exists
    const existingRole = await roleProvider.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    const deleted = await roleProvider.deleteById(id);
    if (!deleted) {
      throw new Error('Failed to delete role');
    }
    
    return { success: true, message: 'Role deleted successfully' };
  },

  findByName: async (name) => {
    const role = await roleProvider.findByName(name);
    return role ? role.get({ plain: true }) : null;
  }
};

module.exports = RoleService;
