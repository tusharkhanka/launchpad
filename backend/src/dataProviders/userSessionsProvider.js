const UserSession  = require('../db/models/userSessions'); // adjust the path as per your project structure
const User = require('../db/models/test'); // Assuming this is the user model

const UserSessionDataProvider = {
  create: async ({userId, token, expiresAt}) => {
    const session = await UserSession.create({
        user_id: userId,
        token: token,
        expiry: expiresAt
      });
    return session; 
  },

  findByToken: async (token) => {
    const session = await UserSession.findOne({ where: { token } });
    
    if (session) {
      // Fetch user data separately
      const user = await User.findByPk(session.user_id);
      return {
        ...session.toJSON(),
        user: user
      };
    }
    
    return null;
  },

  // Find session by token from master (forcing master DB read if using read-replica setup)
//   findByTokenFromMaster: async (token) => {
//     return UserSession.findOne({
//       where: { token },
//       useMaster: true 
//     });
//   },
};

module.exports = UserSessionDataProvider;
