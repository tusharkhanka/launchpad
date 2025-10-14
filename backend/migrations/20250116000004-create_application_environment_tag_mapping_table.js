'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('application_environment_tag_mapping', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      application_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'applications',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      environment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'environments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('application_environment_tag_mapping', ['application_id'], {
      name: 'idx_app_env_tag_app_id'
    });

    await queryInterface.addIndex('application_environment_tag_mapping', ['tag_id'], {
      name: 'idx_app_env_tag_tag_id'
    });

    await queryInterface.addIndex('application_environment_tag_mapping', ['environment_id'], {
      name: 'idx_app_env_tag_env_id'
    });

    // Add unique constraint to prevent duplicate mappings
    await queryInterface.addIndex('application_environment_tag_mapping', ['application_id', 'tag_id', 'environment_id'], {
      name: 'unique_app_env_tag_mapping',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('application_environment_tag_mapping');
  }
};
