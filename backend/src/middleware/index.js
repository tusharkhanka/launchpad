const cors = require('cors');
const bodyParser = require('body-parser');
const { auditTrailMiddleware } = require('../utils/auditTrailMiddleware');

module.exports = {
  cors: cors(),
  jsonParser: bodyParser.json({ limit: '1mb' }),
  formParser: bodyParser.urlencoded({ extended: true }),
  auditTrailMiddleware: auditTrailMiddleware,
};
