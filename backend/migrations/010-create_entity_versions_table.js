'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entity_versions', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      version: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      from_version: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      operation: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('entity_versions', ['entity_type', 'entity_id', 'version'], {
      name: 'entity_versions_composite_index'
    });

    await queryInterface.addIndex('entity_versions', ['entity_type'], {
      name: 'entity_versions_entity_type_index'
    });

    await queryInterface.addIndex('entity_versions', ['entity_id'], {
      name: 'entity_versions_entity_id_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('entity_versions');
  }
};
