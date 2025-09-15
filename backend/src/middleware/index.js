const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = {
  cors: cors(),
  jsonParser: bodyParser.json({ limit: '1mb' }),
  formParser: bodyParser.urlencoded({ extended: true }),

};
