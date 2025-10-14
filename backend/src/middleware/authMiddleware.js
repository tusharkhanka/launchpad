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
      
      if (!token) {
        return res.status(401).json({
          error: true,
          message: "No token provided",
          statusCode: 401
        });
      }

      const session = await userSessionProvider.findByToken(token);

      if (!session) {
        return res.status(401).json({
          error: true,
          message: "Invalid session",
          statusCode: 401
        });
      }

      // Check if session is expired
      if (session.expiry && new Date() > new Date(session.expiry)) {
        return res.status(401).json({
          error: true,
          message: "Session expired",
          statusCode: 401
        });
      }

      req.user = session.user;
      return next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        statusCode: 500
      });
    }
  };
};

module.exports = { isUserAuthenticated };
