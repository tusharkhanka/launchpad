const AuthService = require('../../services/auth/auth.service');
const { getErrorMessage } = require("../../utils/errorMessage");
const responseWrapper = require("../../utils/responseWrapper");
const { Constants } = require('../../constants');
const respErrConstants = Constants.RESPONSES.ERROR_TEXTS;

const Authcontroller = {};


Authcontroller.register = async (req, res) => {
    try {
        const response = await AuthService.register(req.body);
        return responseWrapper.successResponse(
            res,
            200,
            response,
            "Signup Succeded"
        );
    } catch (error) {
        return responseWrapper.errorResponse(
            res,
            500,
            getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
            error
        );
    }
}

Authcontroller.login = async (req, res) => {
    try {
        const response = await AuthService.login(req.body);
        return responseWrapper.successResponse(
            res,
            200,
            response,
            "Successfully logged in"
        );
    } catch (error) {
        return responseWrapper.errorResponse(
            res,
            500,
            getErrorMessage(error) || respErrConstants.ERROR_500_MESSAGE,
            error
        );
    }
}

Authcontroller.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return responseWrapper.errorResponse(
                res,
                401,
                "No token provided"
            );
        }

        await AuthService.logout(token);

        return responseWrapper.successResponse(
            res,
            200,
            { message: "Sucessfully Logged out" }
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


module.exports = Authcontroller;