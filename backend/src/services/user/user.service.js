const userProvider = require('../../dataProviders/userProvider'); 

const UserService = {};

UserService.getAllUsers = async()=> {
    const response = await userProvider.findAll();
    return response;
}

module.exports = UserService;