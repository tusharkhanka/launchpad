'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Find existing FK constraint name for cloud_account.organisation_id
    const [rows] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'cloud_account'
        AND COLUMN_NAME = 'organisation_id'
        AND REFERENCED_TABLE_NAME IS NOT NULL
      LIMIT 1
    `);

    if (rows && rows.length && rows[0].CONSTRAINT_NAME) {
      const name = rows[0].CONSTRAINT_NAME;
      await queryInterface.sequelize.query(`ALTER TABLE cloud_account DROP FOREIGN KEY \`${name}\``);
    }

    await queryInterface.sequelize.query(`
      ALTER TABLE cloud_account
      ADD CONSTRAINT fk_cloud_account_organisation_id
      FOREIGN KEY (organisation_id) REFERENCES organisation(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop the RESTRICT constraint and add CASCADE back
    try {
      await queryInterface.sequelize.query(`ALTER TABLE cloud_account DROP FOREIGN KEY fk_cloud_account_organisation_id`);
    } catch (e) {
      // ignore if not present
    }

    await queryInterface.sequelize.query(`
      ALTER TABLE cloud_account
      ADD CONSTRAINT fk_cloud_account_organisation_id
      FOREIGN KEY (organisation_id) REFERENCES organisation(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
    `);
  },
};

