const responseWrapper = require('../../utils/responseWrapper');
const { getErrorMessage } = require('../../utils/errorMessage');
const { Constants } = require('../../constants');
const Service = require('../../services/cloudAccounts/cloudAccounts.service');

const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const Controller = {};

Controller.createUnderOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { provider, accountIdentifier, accessRole, metadata } = req.body;
    const created = await Service.createUnderOrg(orgId, { provider, accountIdentifier, accessRole, metadata });
    return responseWrapper.successResponse(res, 201, created);
  } catch (error) {
    // Map FK constraint errors to 400 Bad Request for clearer client feedback
    const code = error && error.parent && (error.parent.code || error.parent.sqlState || error.parent.errno);
    if (code === 'ER_NO_REFERENCED_ROW_2' || code === 1452) {
      return responseWrapper.errorResponse(res, 400, 'Invalid reference: orgId');
    }
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

Controller.listUnderOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const list = await Service.listUnderOrg(orgId);
    return responseWrapper.successResponse(res, 200, list);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

Controller.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Service.getById(id);
    if (!item) {
      return responseWrapper.errorResponse(res, 404, 'Cloud account not found');
    }
    return responseWrapper.successResponse(res, 200, item);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

Controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Service.getById(id);
    if (!existing) {
      return responseWrapper.errorResponse(res, 404, 'Cloud account not found');
    }
    if (typeof req.body.accessRole === 'undefined' && typeof req.body.metadata === 'undefined') {
      return responseWrapper.errorResponse(res, 400, 'At least one of accessRole or metadata must be provided');
    }
    const updated = await Service.update(id, { accessRole: req.body.accessRole, metadata: req.body.metadata });
    return responseWrapper.successResponse(res, 200, updated);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

Controller.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Service.getById(id);
    if (!existing) {
      return responseWrapper.errorResponse(res, 404, 'Cloud account not found');
    }
    await Service.remove(id);
    return res.status(204).send();
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

module.exports = Controller;

