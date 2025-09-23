const apiPrefix = '/api/v1';
const {isUserAuthenticated} = require('../middleware/authMiddleware')
module.exports = function(app){
    app.get('/health', (req,res)=> {
        res.send("The app is up and running!")
    });

    app.use(`${apiPrefix}/auth`, require('../controllers/auth'))
    app.use(isUserAuthenticated())
    app.use(`${apiPrefix}/user`, require('../controllers/user'))
    app.use(`${apiPrefix}/organisations`, require('../controllers/organisations'))
    app.use(`${apiPrefix}/organisations`, require('../controllers/organisations/cloudAccounts'))
    app.use(`${apiPrefix}/organisations`, require('../controllers/organisations/environments'))
    app.use(`${apiPrefix}/cloud-accounts`, require('../controllers/cloudAccounts'))
    app.use(`${apiPrefix}/environments`, require('../controllers/environments'))


}