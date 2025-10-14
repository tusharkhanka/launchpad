const orgProvider = require('../../dataProviders/organisationProvider');

const OrgService = {
  create: async ({ name }) => {
    const created = await orgProvider.create({ name });
    return created.get({ plain: true });
  },
  getById: async (id) => {
    return orgProvider.findById(id);
  },
  list: async () => {
    return orgProvider.findAll();
  },
  update: async (id, { name }) => {
    const affected = await orgProvider.updateById(id, { name });
    if (!affected) return null;
    return orgProvider.findById(id);
  },
  remove: async (id) => {
    return orgProvider.deleteById(id);
  },
};

module.exports = OrgService;

