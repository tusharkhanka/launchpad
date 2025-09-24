const { Constants } = require('../constants');
const ValidationError = require('./validator.error');
const Unauthorized = require('./unauthorized.error');

const respWrapperErrConstants = Constants.RESPONSES.ERROR_TEXTS;
const respWrapperSuccessConstants = Constants.RESPONSES.SUCCESS_TEXTS;

function validateStatus(statusCode) {
  if (statusCode == null) {
    throw new Error(respWrapperErrConstants.STATUS_CODE_MISSING);
  }
}

const responseWrapper = {
  successResponse: (res, statusCode, data, message) => {
    validateStatus(statusCode);

    if (!data) {
      throw new Error(respWrapperErrConstants.DATA_MISSING);
    }

    return res.status(statusCode).json({
      data,
      message: message || respWrapperSuccessConstants.SUCCESS,
      statusCode,
    });
  },

  errorResponse: (res, statusCode, errorMessage, errObject, data) => {
    validateStatus(statusCode);

    if (!errorMessage) {
      throw new Error(respWrapperErrConstants.MESSAGE_MISSING);
    }

    let responseErrorMessage = errorMessage;

    if (errObject instanceof ValidationError || errObject instanceof Unauthorized) {
      responseErrorMessage = errObject.message;
    }

    return res.status(statusCode).json({
      error: true,
      data,
      message: responseErrorMessage,
      statusCode,
    });
  },
};

module.exports = responseWrapper;
