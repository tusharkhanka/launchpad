const responseWrapper = require('../../utils/responseWrapper');
const { getErrorMessage } = require('../../utils/errorMessage');
const { Constants } = require('../../constants');
const AuditTrailService = require('../../services/auditTrail/auditTrail.service');

const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const AuditTrailController = {};

AuditTrailController.create = async (req, res) => {
  try {
    const { action, entity, auditData, status = 'SUCCESS' } = req.body;
    const { id: userId } = req.user;
    const value = JSON.stringify(auditData);
    
    const response = await AuditTrailService.create({ 
      action, 
      entity, 
      value, 
      userId, 
      status 
    });

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

AuditTrailController.getPaginated = async (req, res) => {
  try {
    // const { isSuperAdmin } = req.user;
    const { limit = 50, offset = 0 } = req.query;

    // if (isSuperAdmin) {
      const response = await AuditTrailService.getPaginated(limit, offset);
      return responseWrapper.successResponse(res, 200, response);
    // } else {
    //   const response = {
    //     auditTrailData: [],
    //     totalCount: 0,
    //     message: respErrConstants.SUPER_ADMIN_ACCESS_DENIED,
    // //   };
    //   return responseWrapper.successResponse(res, 200, response);
    // }
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

AuditTrailController.getByUserId = async (req, res) => {
  try {
    // const { isSuperAdmin } = req.user;
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // if (isSuperAdmin) {
     
    // } else {
    //   const response = {
    //     auditTrailData: [],
    //     totalCount: 0,
    //     message: respErrConstants.SUPER_ADMIN_ACCESS_DENIED,
    //   };
    //   return responseWrapper.successResponse(res, 200, response);
    // }
    const response = await AuditTrailService.getByUserId(userId, limit, offset);
    return responseWrapper.successResponse(res, 200, response);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

AuditTrailController.getByEntity = async (req, res) => {
  try {
    // const { isSuperAdmin } = req.user;
    const { entity } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // if (isSuperAdmin) {
     
    // } else {
    //   const response = {
    //     auditTrailData: [],
    //     totalCount: 0,
    //     message: respErrConstants.SUPER_ADMIN_ACCESS_DENIED,
    //   };
    //   return responseWrapper.successResponse(res, 200, response);
    // }
    const response = await AuditTrailService.getByEntity(entity, limit, offset);
    return responseWrapper.successResponse(res, 200, response);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

AuditTrailController.getByAction = async (req, res) => {
  try {
    // const { isSuperAdmin } = req.user;
    const { action } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // if (isSuperAdmin) {
      
    // } else {
    //   const response = {
    //     auditTrailData: [],
    //     totalCount: 0,
    //     message: respErrConstants.SUPER_ADMIN_ACCESS_DENIED,
    //   };
    //   return responseWrapper.successResponse(res, 200, response);
    // }
    const response = await AuditTrailService.getByAction(action, limit, offset);
      return responseWrapper.successResponse(res, 200, response);

  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

AuditTrailController.getByStatus = async (req, res) => {
  try {
    // const { isSuperAdmin } = req.user;
    const { status } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // if (isSuperAdmin) {
     
    // } else {
    //   const response = {
    //     auditTrailData: [],
    //     totalCount: 0,
    //     message: respErrConstants.SUPER_ADMIN_ACCESS_DENIED,
    //   };
    //   return responseWrapper.successResponse(res, 200, response);
    // }
    const response = await AuditTrailService.getByStatus(status, limit, offset);
    return responseWrapper.successResponse(res, 200, response);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

module.exports = AuditTrailController;

