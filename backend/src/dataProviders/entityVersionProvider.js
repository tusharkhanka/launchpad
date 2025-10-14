const { EntityVersion } = require('../db/models');

class EntityVersionProvider {
  async create(data) {
    return await EntityVersion.create(data);
  }

  async findById(id) {
    return await EntityVersion.findByPk(id);
  }

  async findAll(where = {}) {
    return await EntityVersion.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
  }

  async findByEntity(entityType, entityId) {
    return await EntityVersion.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId
      },
      order: [['created_at', 'DESC']]
    });
  }

  async updateById(id, data) {
    return await EntityVersion.update(data, {
      where: { id }
    });
  }

  async deleteById(id) {
    return await EntityVersion.destroy({
      where: { id }
    });
  }
}

module.exports = new EntityVersionProvider();

