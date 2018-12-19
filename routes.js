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
//var thingsController = require('./controllers/thingsController');

// Tags routes
router.route('/tags')
    .get(tagController.index)
    .post(tagController.create);

// User routes
router.route('/user')
    .get(userController.index)
    .post(userController.index);

// Things routes
// router.route('/things')
//     .get(thingsController.index)
//     .post(thingsController.create);
// router.route('/things/:thing_id')
//     .get(thingsController.view)
//     .post(thingsController.update);

// Export API routes
module.exports = router;