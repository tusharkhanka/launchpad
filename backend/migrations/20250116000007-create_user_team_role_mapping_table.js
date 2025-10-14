'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_team_role_mapping', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Test',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      team_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
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
    await queryInterface.addIndex('user_team_role_mapping', ['user_id'], {
      name: 'user_team_role_mapping_user_id_index'
    });

    await queryInterface.addIndex('user_team_role_mapping', ['team_id'], {
      name: 'user_team_role_mapping_team_id_index'
    });

    await queryInterface.addIndex('user_team_role_mapping', ['role_id'], {
      name: 'user_team_role_mapping_role_id_index'
    });

    // Add unique constraint for user-team combination
    await queryInterface.addIndex('user_team_role_mapping', ['user_id', 'team_id'], {
      unique: true,
      name: 'user_team_role_mapping_user_team_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_team_role_mapping');
  }
};
