const UserSession  = require('../db/models/userSessions'); // adjust the path as per your project structure

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
    return UserSession.findOne({ where: { token } });
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
