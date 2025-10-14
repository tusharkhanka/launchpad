const { Team } = require('../db/models');

const teamProvider = {
  create: async (data) => {
    return Team.create(data);
  },

  findById: async (id) => {
    return Team.findByPk(id);
  },

  findAll: async () => {
    return Team.findAll({
      order: [['created_at', 'DESC']]
    });
  },

  updateById: async (id, data) => {
    const [affectedCount] = await Team.update(data, {
      where: { id }
    });
    return affectedCount > 0;
  },

  deleteById: async (id) => {
    const deletedCount = await Team.destroy({
      where: { id }
    });
    return deletedCount > 0;
  },

  findByEmail: async (email) => {
    return Team.findOne({
      where: { email }
    });
  },

  findByName: async (name) => {
    return Team.findOne({
      where: { name }
    });
  }
};

module.exports = teamProvider;
