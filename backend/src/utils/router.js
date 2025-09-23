const apiPrefix = '/api/v1';
const {isUserAuthenticated} = require('../middleware/authMiddleware')
module.exports = function(app){
    app.get('/health', (req,res)=> {
        res.send("The app is up and running!")
    });

    app.use(`${apiPrefix}/auth`, require('../controllers/auth'))
    app.use(isUserAuthenticated())
    app.use(`${apiPrefix}/user`, require('../controllers/user'))

}