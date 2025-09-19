const { validationResult } = require('express-validator');
const responseWrapper = require('./responseWrapper');

function ValidateRequestErrors() {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseWrapper.errorResponse(
        res,
        400,
        'invalid request parameters',
        {},
        errors.array()
      );
      return;
    }
    next();
  };
}

module.exports = ValidateRequestErrors;
