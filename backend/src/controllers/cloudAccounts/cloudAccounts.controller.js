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

