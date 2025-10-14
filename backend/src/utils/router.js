const apiPrefix = '/api/v1';
const {isUserAuthenticated} = require('../middleware/authMiddleware')
module.exports = function(app){
    app.get('/health', (req,res)=> {
        res.send("The app is up and running!")
    });

    // Mount Swagger UI before auth to allow browsing docs
    try { require('../utils/swagger')(app); } catch (e) { /* noop if swagger deps missing */ }

    app.use(`${apiPrefix}/auth`, require('../controllers/auth'))
    app.use(isUserAuthenticated())
    app.use(`${apiPrefix}/user`, require('../controllers/user'))
    app.use(`${apiPrefix}/teams`, require('../controllers/teams'))
    app.use(`${apiPrefix}/roles`, require('../controllers/roles'))
    app.use(`${apiPrefix}/applications`, require('../controllers/applications'))
    // Mount organisation routes with specific path patterns to avoid route shadowing
    app.use(`${apiPrefix}/organisations`, require('../controllers/organisations'))
    app.use(`${apiPrefix}/cloud-accounts`, require('../controllers/cloudAccounts'))
    app.use(`${apiPrefix}/environments`, require('../controllers/environments'))
    app.use(`${apiPrefix}/auditlogs`, require('../controllers/auditTrail'))
    // Mount nested routes using mergeParams
    const cloudAccountsRouter = require('../controllers/cloudAccounts/org.routes');
    const environmentsRouter = require('../controllers/environments/org.routes');
    
    app.use(`${apiPrefix}/organisations/:orgId/cloud-accounts`, cloudAccountsRouter);
    app.use(`${apiPrefix}/organisations/:orgId/environments`, environmentsRouter);
 


}