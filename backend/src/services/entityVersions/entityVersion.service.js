const entityVersionProvider = require('../../dataProviders/entityVersionProvider');

class EntityVersionService {
  async create(data) {
    return await entityVersionProvider.create(data);
  }

  async getById(id) {
    return await entityVersionProvider.findById(id);
  }

  async list(where = {}) {
    return await entityVersionProvider.findAll(where);
  }

  async update(id, data) {
    return await entityVersionProvider.updateById(id, data);
  }

  async remove(id) {
    return await entityVersionProvider.deleteById(id);
  }

  async getEntityVersions({ entity_type, entity_id }) {
    return await entityVersionProvider.findByEntity(entity_type, entity_id);
  }

  async createVersionRecord({ entity_type, entity_id, version, from_version, operation, metadata }) {
    return await this.create({
      entity_type,
      entity_id,
      version,
      from_version,
      operation,
      metadata
    });
  }
}

module.exports = new EntityVersionService();
