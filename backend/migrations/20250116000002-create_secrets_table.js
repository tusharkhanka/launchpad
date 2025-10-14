'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('secrets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      secret_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      current_version_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_version_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
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

    // Add index for secret_id
    await queryInterface.addIndex('secrets', ['secret_id'], {
      name: 'idx_secrets_secret_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('secrets');
  }
};

