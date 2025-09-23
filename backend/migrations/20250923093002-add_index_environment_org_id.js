'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('environment', ['organisation_id'], {
      name: 'idx_environment_organisation_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('environment', 'idx_environment_organisation_id');
  },
};

