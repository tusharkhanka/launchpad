const userSessionProvider = require('../dataProviders/userSessionsProvider'); 

const getToken = (headers) => {
  let token = headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  return token;
};

const isUserAuthenticated = () => {
  return async (req, res, next) => {
    try {
      const token = getToken(req.headers);
      const session = await userSessionProvider.findByToken(token);

      if (session) {
        req.user = session.user;
        return next();
      } else {
        return res.status(400).json({
          error: true,
          message: "Invalid session",
          statusCode: 400
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        statusCode: 500
      });
    }
  };
};

module.exports = { isUserAuthenticated };
