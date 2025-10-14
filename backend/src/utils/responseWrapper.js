const { Constants } = require('../constants');
const ValidationError = require('./validator.error');
const Unauthorized = require('./unauthorized.error');
const AuditTrailService = require('../services/auditTrail/auditTrail.service');
const { getAuditTrail } = require('./auditTrailMiddleware');

const respWrapperErrConstants = Constants.RESPONSES.ERROR_TEXTS;
const respWrapperSuccessConstants = Constants.RESPONSES.SUCCESS_TEXTS;

class ResponseWrapper {
  validation = (statusCode) => {
    if (statusCode == null) throw new Error(respWrapperErrConstants.STATUS_CODE_MISSING);
  };

  successResponse = (res, statusCode, data, message) => {
    this.validation(statusCode);

    const userId = res.req.user?.id;
    const action = getAuditTrail('action');
    const entity = getAuditTrail('entity');
    const method = res.req.method;

    // Only create audit trails for POST, PUT, PATCH, DELETE (skip GET requests)
    if (action && entity && method !== 'GET') {
      const auditData = getAuditTrail('data');
      const paramdata = res.req.params;
      const combinedAuditData = { ...auditData, ...paramdata };

      const value = entity === 'AUTH > SSO'
        ? JSON.stringify({
          ...data,
          token: "Hidden"
        })
        : JSON.stringify(combinedAuditData);

      AuditTrailService.create({
        action,
        userId: userId,
        entity,
        status: "SUCCESS",
        value: value,
      }).catch(err => {
        console.error('Error creating audit trail in successResponse:', err);
      });
    }

    if (!data) throw new Error(respWrapperErrConstants.DATA_MISSING);
    res.json({
      data,
      message: message || respWrapperSuccessConstants.SUCCESS,
      statusCode,
    });
  };

  errorResponse = (res, statusCode, errorMessage, errObject, data) => {
    this.validation(statusCode);

    const userId = res.req.user?.id;
    const action = getAuditTrail('action');
    const entity = getAuditTrail('entity');
    const method = res.req.method;

    // Only create audit trails for POST, PUT, PATCH, DELETE (skip GET requests)
    if (action && entity && method !== 'GET') {
      const auditData = getAuditTrail('data');
      const paramdata = res.req.params;
      const combinedAuditData = { ...auditData, ...paramdata };

      const value = entity === 'AUTH > SSO'
        ? JSON.stringify({
          ...data,
          token: "Hidden"
        })
        : JSON.stringify(combinedAuditData);

      AuditTrailService.create({
        action,
        userId: userId,
        entity,
        status: "FAILURE",
        value: `${value} | Message : ${errorMessage}`,
      }).catch(err => {
        console.error('Error creating audit trail in errorResponse:', err);
      });
    }

    if (!errorMessage) throw new Error(respWrapperErrConstants.MESSAGE_MISSING);
    let responseErrorMessage = errorMessage;
    if (errObject instanceof ValidationError || errObject instanceof Unauthorized) {
      responseErrorMessage = errObject.message;
    }

    return res.status(statusCode).json({
      error: true,
      data,
      message: responseErrorMessage,
      statusCode: statusCode,
    });
  };
}

module.exports = new ResponseWrapper();
