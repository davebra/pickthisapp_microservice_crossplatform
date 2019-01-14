const router = require('express').Router();
const tagController = require('./controllers/tagController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const thingController = require('./controllers/thingController');
const uploadController = require('./controllers/uploadController');

// Set default API response
router.get('/', function (req, res) {
    return res.status(200).json({
        message: 'Welcome to PickThisApp Rest API',
    });
});

// User login route
router.route('/login')
    .post(userController.login);

// User signup route
router.route('/signup')
    .post(userController.signup);

// User update route
router.route('/user/:user_id')
    .post(authController.auth, userController.update); // auth middleware

// User things route
router.route('/user/:user_id/things')
    .get(authController.auth, thingController.userthings); // auth middleware

// Tags routes
router.route('/tags')
    .get(tagController.list)
    .post(authController.auth, tagController.create); // auth middleware

// Things routes
router.route('/things')
    .get(thingController.list)
    .post(authController.auth, thingController.create); // auth middleware
router.route('/things/:thing_id')
    .get(thingController.view)
    .post(authController.auth, thingController.update); // auth middleware

// User routes
router.route('/upload')
    .post(authController.auth, uploadController.upload); // auth middleware

// Export API routes
module.exports = router;