const Organisation = require('../db/models/organisation');

const OrganisationDataProvider = {
  create: async (data) => Organisation.create(data),
  findById: async (id) => Organisation.findByPk(id, { raw: true }),
  updateById: async (id, payload) => Organisation.update(payload, { where: { id } }),
  deleteById: async (id) => Organisation.destroy({ where: { id } }),
};

module.exports = OrganisationDataProvider;

