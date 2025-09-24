'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex({ tableName: 'environment' }, ['organisation_id'], {
      name: 'idx_environment_organisation_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex({ tableName: 'environment' }, 'idx_environment_organisation_id');
  },
};

