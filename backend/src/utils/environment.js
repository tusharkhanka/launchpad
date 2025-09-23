const dotenv = require('dotenv');

if (process.env.SECRETS_PATH) {
  dotenv.config({ path: process.env.SECRETS_PATH });
}

dotenv.config();

module.exports = process.env;
