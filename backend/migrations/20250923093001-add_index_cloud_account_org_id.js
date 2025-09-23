'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('cloud_account', ['organisation_id'], {
      name: 'idx_cloud_account_organisation_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('cloud_account', 'idx_cloud_account_organisation_id');
  },
};

