class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  function isErrorWithMessage(error) {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
    );
  }
  
  function toErrorWithMessage(maybeError) {
    if (isErrorWithMessage(maybeError)) return maybeError;
  
    try {
      return new Error(JSON.stringify(maybeError));
    } catch {
      return new Error(String(maybeError));
    }
  }
  
  function getErrorMessage(error) {
    return toErrorWithMessage(error).message;
  }
  
  function getStatusCode(error) {
    if (error && error.statusCode) return error.statusCode;
    return 500;
  }
  
  function extractStatusCode(err) {
    if (err && typeof err === "object") {
      if ("statusCode" in err && typeof err.statusCode === "number") {
        return err.statusCode;
      }
      if ("response" in err && err.response?.status) {
        return err.response.status;
      }
    }
    return 500;
  }
  
  module.exports = {
    CustomError,
    getErrorMessage,
    getStatusCode,
    extractStatusCode
  };