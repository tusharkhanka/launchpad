const provider = require('../../dataProviders/cloudAccountsProvider');

const CloudAccountsService = {
  createUnderOrg: async (orgId, { provider: cloudProvider, accountIdentifier, accessRole, metadata }) => {
    const created = await provider.create({
      organisation_id: orgId,
      provider: cloudProvider,
      account_identifier: accountIdentifier,
      access_role: accessRole,
      metadata: metadata || null,
    });
    return created.get({ plain: true });
  },

  listUnderOrg: async (orgId) => provider.listByOrgId(orgId),

  getById: async (id) => provider.findById(id),

  update: async (id, { accessRole, metadata }) => {
    const payload = {};
    if (typeof accessRole !== 'undefined') payload.access_role = accessRole;
    if (typeof metadata !== 'undefined') payload.metadata = metadata;
    await provider.updateById(id, payload);
    return provider.findById(id);
  },

  remove: async (id) => provider.deleteById(id),
};

module.exports = CloudAccountsService;

