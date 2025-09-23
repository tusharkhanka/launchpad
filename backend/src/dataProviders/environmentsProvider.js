const Environment = require('../db/models/environment');

const EnvironmentsProvider = {
  create: async (data) => Environment.create(data),
  findById: async (id) => Environment.findByPk(id, { raw: true }),
  updateById: async (id, payload) => {
    const [affected] = await Environment.update(payload, { where: { id } });
    return affected;
  },
  deleteById: async (id) => Environment.destroy({ where: { id } }),
  listByOrgId: async (organisation_id) => Environment.findAll({ where: { organisation_id }, raw: true }),
};

module.exports = EnvironmentsProvider;

