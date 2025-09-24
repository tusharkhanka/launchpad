'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('cloud_account', ['organisation_id'], {
      name: 'idx_cloud_account_organisation_id',
      using: 'BTREE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('cloud_account', 'idx_cloud_account_organisation_id');
  },
};

