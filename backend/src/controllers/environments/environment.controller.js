const responseWrapper = require('../../utils/responseWrapper');
const { getErrorMessage } = require('../../utils/errorMessage');
const { Constants } = require('../../constants');
const EnvironmentService = require('../../services/environments/environment.service');

const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const EnvironmentController = {};

EnvironmentController.create = async (req, res) => {
  try {
    const { name, cloud_account_id, vpc_id, metadata } = req.body;
    const { orgId } = req.params;

    const created = await EnvironmentService.create({
      name,
      cloud_account_id,
      vpc_id,
      org_id: orgId,
      metadata,
    });

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

EnvironmentController.list = async (req, res) => {
  try {
    const environments = await EnvironmentService.list();
    return responseWrapper.successResponse(res, 200, environments);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

EnvironmentController.listByOrganisation = async (req, res) => {
  try {
    const { orgId } = req.params;
    const environments = await EnvironmentService.listByOrganisationId(orgId);
    return responseWrapper.successResponse(res, 200, environments);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

EnvironmentController.listByCloudAccount = async (req, res) => {
  try {
    const { cloudAccountId } = req.params;
    const environments = await EnvironmentService.listByCloudAccountId(cloudAccountId);
    return responseWrapper.successResponse(res, 200, environments);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

EnvironmentController.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const environment = await EnvironmentService.getById(id);
    
    if (!environment) {
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
    }
    
    return responseWrapper.successResponse(res, 200, environment);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

EnvironmentController.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cloudAccountId, vpcId, metadata } = req.body;

    const existing = await EnvironmentService.getById(id);
    if (!existing) {
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
    }

    const updated = await EnvironmentService.update(id, {
      name,
      cloudAccountId,
      vpcId,
      metadata,
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

EnvironmentController.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await EnvironmentService.getById(id);
    if (!existing) {
      return responseWrapper.errorResponse(res, 404, 'Environment not found');
    }
    
    await EnvironmentService.remove(id);
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

EnvironmentController.getStats = async (req, res) => {
  try {
    const { orgId } = req.params;
    const stats = await EnvironmentService.getEnvironmentStats(orgId);
    return responseWrapper.successResponse(res, 200, stats);
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

module.exports = EnvironmentController;
