const swaggerUi = require('swagger-ui-express');
const spec = require('../docs/swagger');

module.exports = function mountSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
};

