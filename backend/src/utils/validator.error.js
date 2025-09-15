class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  // CommonJS export
  module.exports = ValidationError;
  