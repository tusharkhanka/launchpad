const User = require('../db/models/test');


const UserDataProvider = {
    findByEmail: async(email)=> {
        return User.findOne({ where: { email },raw: true });
      },
    create:async(data)=> {
        return User.create(data);
      },
    findAll:async()=> {
        return User.findAll();
    }
      
}
module.exports = UserDataProvider;
