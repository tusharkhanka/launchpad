const provider = require('../../dataProviders/environmentsProvider');

const EnvironmentsService = {
  createUnderOrg: async (orgId, { name, region, vpcId, cloudAccountId, metadata }) => {
    if (typeof cloudAccountId === 'undefined' || cloudAccountId === null) {
      throw new Error('cloudAccountId is required');
    }
    const created = await provider.create({
      organisation_id: orgId,
      name,
      region: region || null,
      vpc_id: typeof vpcId !== 'undefined' ? vpcId : null,
      cloud_account_id: cloudAccountId,
      // state defaults to CREATING per model
      metadata: metadata || null,
    });
    return created.get({ plain: true });
  },

  listUnderOrg: async (orgId) => provider.listByOrgId(orgId),

  getById: async (id) => provider.findById(id),

  update: async (id, { name, region, vpcId, metadata }) => {
    const payload = {};
    if (typeof name !== 'undefined') payload.name = name;
    if (typeof region !== 'undefined') payload.region = region;
    if (typeof vpcId !== 'undefined') payload.vpc_id = vpcId;
    if (typeof metadata !== 'undefined') payload.metadata = metadata;
    await provider.updateById(id, payload);
    return provider.findById(id);
  },

  remove: async (id) => provider.deleteById(id),
};

module.exports = EnvironmentsService;

