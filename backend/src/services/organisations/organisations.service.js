const orgProvider = require('../../dataProviders/organisationProvider');

const OrgService = {
  create: async ({ name }) => {
    const created = await orgProvider.create({ name });
    return created.get({ plain: true });
  },
  getById: async (id) => {
    return orgProvider.findById(id);
  },
  update: async (id, { name }) => {
    await orgProvider.updateById(id, { name });
    return orgProvider.findById(id);
  },
  remove: async (id) => {
    return orgProvider.deleteById(id);
  },
};

module.exports = OrgService;

