'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change entity_id column from BIGINT to STRING to support UUIDs
    await queryInterface.changeColumn('entity_versions', 'entity_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to BIGINT (this might cause data loss if UUIDs were stored)
    await queryInterface.changeColumn('entity_versions', 'entity_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  }
};

