const RequestWrapper = (func) => {
    return (req, res, next) => {
      return func(req, res, next);
    };
  };
  
  module.exports = RequestWrapper;
  