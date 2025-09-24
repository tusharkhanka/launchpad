const responseWrapper = require('../../utils/responseWrapper');
const { getErrorMessage } = require('../../utils/errorMessage');
const { Constants } = require('../../constants');
const Service = require('../../services/environments/environments.service');

const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const Controller = {};

Controller.createUnderOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { name, region, vpcId, cloudAccountId, metadata } = req.body;
    const created = await Service.createUnderOrg(orgId, { name, region, vpcId, cloudAccountId, metadata });
    return responseWrapper.successResponse(res, 201, created);
  } catch (error) {
    // Map FK constraint errors to 400 Bad Request for clearer client feedback
    const code = error && error.parent && (error.parent.code || error.parent.sqlState || error.parent.errno);
    if (code === 'ER_NO_REFERENCED_ROW_2' || code === 1452) {
      return responseWrapper.errorResponse(res, 400, 'Invalid reference: cloudAccountId or orgId');
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
    const env = await Service.getById(id);
    if (!env) {
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
    }
    return responseWrapper.successResponse(res, 200, env);
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
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
    }
    const updated = await Service.update(id, {
      name: req.body.name,
      region: req.body.region,
      vpcId: req.body.vpcId,
      metadata: req.body.metadata,
    });
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
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
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

// Lifecycle stubs (501 Not Implemented)
Controller.provision = async (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});
Controller.destroy = async (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});
Controller.status = async (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

module.exports = Controller;

