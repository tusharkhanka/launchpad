'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cloud_account', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      account_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_identifier: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      organisation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'organisation', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      access_keys: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('cloud_account', ['organisation_id']);
    await queryInterface.addIndex('cloud_account', ['provider']);
    await queryInterface.addIndex('cloud_account', ['account_identifier']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cloud_account');
  }
};
