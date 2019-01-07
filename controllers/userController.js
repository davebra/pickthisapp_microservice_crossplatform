let User = require('../models/userModel');
let uuidv5 = require('uuid/v5');

// Handle index actions
exports.index = function (req, res) {

    //validation of required fields
    if (
        typeof req.body.provider !== 'string' || 
        typeof req.body.providerid !== 'string' ||
        typeof req.body.email !== 'string' ||
        typeof req.body.fullname !== 'string'
        ) {
            res.json({
                status: "error",
                message: "Bad request",
            });
        return;
    }

    // create the user object and fill with data
    var newUser = new User();
    newUser._id = uuidv5(req.body.providerid, '300005f7-1174-47bf-bf0a-9a4a99887c88');
    newUser.status = 'enabled'; //enabled, suspended, disabled
    newUser.provider = req.body.provider;
    newUser.providerid = req.body.providerid;
    newUser.email = req.body.email;
    newUser.fullname = req.body.fullname;
    newUser.things = [];

    // find user in the database
    User.findById(newUser.id, function (err, userExists) {

        if (err){
            res.json({
                status: "error",
                message: err,
            });
            return;
        }

        // check if the user exists in mongodb
        if (!userExists){

            // if not exists, save in db and return the user
            newUser.save(function (err) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err,
                    });
                    return;
                }
                res.json({
                    status: "success",
                    message: 'New created and logged in',
                    data: newUser
                });
            });
            return;

        } else {

            // if exsists, return just the object data
            res.json({
                status: "success",
                message: 'User logged in',
                data: userExists.id
            });
            return;

        }

    });      

};


