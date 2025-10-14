const { Role } = require('../db/models');

const roleProvider = {
  create: async (data) => {
    return Role.create(data);
  },

  findById: async (id) => {
    return Role.findByPk(id);
  },

  findAll: async () => {
    return Role.findAll({
      order: [['created_at', 'DESC']]
    });
  },

  updateById: async (id, data) => {
    const [affectedCount] = await Role.update(data, {
      where: { id }
    });
    return affectedCount > 0;
  },

  deleteById: async (id) => {
    const deletedCount = await Role.destroy({
      where: { id }
    });
    return deletedCount > 0;
  },

  findByName: async (name) => {
    return Role.findOne({
      where: { name }
    });
  }
};

module.exports = roleProvider;
