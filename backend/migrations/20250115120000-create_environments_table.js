'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('environments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cloud_account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cloud_account',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      org_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organisation',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('environments', ['cloud_account_id']);
    await queryInterface.addIndex('environments', ['org_id']);
    await queryInterface.addIndex('environments', ['name', 'org_id'], {
      unique: true,
      name: 'environments_name_org_id_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('environments');
  }
};
