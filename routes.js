let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Works',
        message: 'Welcome to PickThisApp Rest API',
    });
});

// Import controllers
var tagController = require('./controllers/tagController');
var userController = require('./controllers/userController');
var thingController = require('./controllers/thingController');
var uploadController = require('./controllers/uploadController');

// Tags routes
router.route('/tags')
    .get(tagController.index)
    .post(tagController.create);

// User routes
router.route('/user')
    .get(userController.index)
    .post(userController.index);

// Things routes
router.route('/things')
    .get(thingController.index)
    .post(thingController.create);
router.route('/things/:thing_id')
    .get(thingController.view)
    .post(thingController.update);

// User routes
router.route('/upload')
    .get(uploadController.index)
    .post(uploadController.index);

// Export API routes
module.exports = router;