const userProvider = require('../../dataProviders/userProvider'); 

const UserService = {};

UserService.getAllUsers = async()=> {
    const response = await userProvider.findAll();
    return response;
}

UserService.getById = async()=> {
    const response = await userProvider.findOneById(userId);
    return response;
}

module.exports = UserService;