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
    // Mount nested organisation-scoped routes BEFORE generic organisations CRUD to avoid shadowing
    app.use(`${apiPrefix}/organisations`, require('../controllers/cloudAccounts/org.routes'))
    app.use(`${apiPrefix}/organisations`, require('../controllers/environments/org.routes'))
    app.use(`${apiPrefix}/organisations`, require('../controllers/organisations'))
    // Top-level resource routes
    app.use(`${apiPrefix}/cloud-accounts`, require('../controllers/cloudAccounts'))
    app.use(`${apiPrefix}/environments`, require('../controllers/environments'))


}