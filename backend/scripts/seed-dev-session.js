'use strict';
require('dotenv').config();
const crypto = require('crypto');
const AppDataSource = require('../src/db/dataSource');
const User = require('../src/db/models/test');
const UserSession = require('../src/db/models/userSessions');

(async () => {
  try {
    await AppDataSource.authenticate();

    // Ensure a dev user exists (or create one)
    const email = process.env.DEV_USER_EMAIL || 'dev@example.com';
    const username = process.env.DEV_USER_NAME || 'dev';

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ username, email, password: 'dev-password' });
    }

    // Create a session token valid for 7 days
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await UserSession.create({
      user_id: user.id,
      token,
      expiry: expiresAt,
    });

    // Output minimal information for local usage
    console.log(JSON.stringify({ token, expiresAt }));
    console.log(`Authorization: Bearer ${token}`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to seed dev session:', err);
    process.exit(1);
  }
})();

