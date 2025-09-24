const CloudAccount = require('../db/models/cloudAccount');

const CloudAccountProvider = {
  create: async (data) => CloudAccount.create(data),
  findById: async (id) => CloudAccount.findByPk(id, { raw: true }),
  updateById: async (id, payload) => {
    const [affected] = await CloudAccount.update(payload, { where: { id } });
    return affected;
  },
  deleteById: async (id) => CloudAccount.destroy({ where: { id } }),
  listByOrgId: async (organisation_id) => CloudAccount.findAll({ where: { organisation_id }, raw: true }),
};

module.exports = CloudAccountProvider;

