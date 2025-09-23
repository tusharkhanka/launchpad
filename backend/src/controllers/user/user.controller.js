const { getErrorMessage } = require("../../utils/errorMessage");
const responseWrapper = require("../../utils/responseWrapper");
const userService = require('../../services/user/user.service'); 
const { Constants } = require('../../constants');
const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const UserController = {};

UserController.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return responseWrapper.successResponse(
      res,
      200,
      users
    );
  } catch (error) {
    return responseWrapper.errorResponse(
      res,
      500,
      getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
      error
    );
  }
};

module.exports = UserController;
