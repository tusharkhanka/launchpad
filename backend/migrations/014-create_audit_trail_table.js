'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_trail', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // Allow null for unauthenticated operations (e.g., login/SSO attempts)
        references: {
          model: 'Test',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      entity: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      value: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
    });

    await queryInterface.addIndex('audit_trail', ['created_at']);
    await queryInterface.addIndex('audit_trail', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_trail');
  }
};

