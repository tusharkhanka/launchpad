'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('environment', ['cloud_account_id'], {
      name: 'idx_environment_cloud_account_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('environment', 'idx_environment_cloud_account_id');
  },
};

