User = require('../models/userModel');
let uuidv5 = require('uuid/v5');

// Handle index actions
exports.index = function (req, res) {

    //validation
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

    const ts = new Date().getTime();


    var newUser = new User();
    newUser._id = uuidv5(req.body.providerid, '300005f7-1174-47bf-bf0a-9a4a99887c88');
    newUser.status = 'enabled'; //enabled, suspended, disabled
    newUser.timestamp = ts;
    newUser.provider = req.body.provider;
    newUser.providerid = req.body.providerid;
    newUser.email = req.body.email;
    newUser.fullname = req.body.fullname;
    newUser.things = [];

    User.findById(newUser.id, function (err, userExists) {

        if (err)
            res.send(err);

        if (!userExists){

            // save the tag and check for errors
            newUser.save(function (err) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err,
                    });
                }
                res.json({
                    status: "success",
                    message: 'New created and logged in',
                    data: newUser
                });
            });

        } else {

            res.json({
                status: "success",
                message: 'User logged in',
                data: userExists.id
            });

        }

    });      

};


