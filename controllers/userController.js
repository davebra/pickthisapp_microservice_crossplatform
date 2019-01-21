const User = require('../models/userModel');
const redis = require('redis'); // redis DB library
const jwt = require('jsonwebtoken'); // JavascriptWebToken Library

// Connect to Redis to store/get token data
const redisClient = redis.createClient( process.env.REDIS_URL );
redisClient.on("error", function (err) {
    console.log("Error " + err);
});

// Handle login action
exports.login = function (req, res) {

    //validation of required fields
    if (
        typeof req.body.provider !== 'string' || 
        typeof req.body.providerid !== 'string'
        ) {
            return res.status(400).json({
                message: "Bad request",
            });
    }

    // find user in the database
    User.findOne({ provider: req.body.provider, providerid: req.body.providerid }, function (err, user) {

        // something wrong with mongodb
        if (err){
            return res.status(500).json({
                message: err,
            });
        }

        // check if the user exists in mongodb
        if (!user){
            // if not exists, return the message that user not exists
            return res.status(404).json({
                message: 'User not exists'
            });
        }

        // if exsists, create a new token and return it
        const token = jwt.sign(
            { 
                nickname: user.nickname // save the nickname as token payload
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // save the token to redis db, expire in 24h, like the JWT
        redisClient.set(token, JSON.stringify(user), 'EX', 24 * 3600);

        // set a cookie for the client, so it already have the token in the browser cookies
        res.cookie('access_token', token, {
            maxAge: 1000 * 3600 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
            signed: true // Indicates if the cookie should be signed
        });

        // return the JWT token for the future API calls
        res.status(200).json({
            message: 'Authentication successful!',
            accesstoken: token
        });

    });      

};

// Handle signup action
exports.signup = function (req, res) {

    //validation of required fields
    if (
        typeof req.body.provider !== 'string' || 
        typeof req.body.providerid !== 'string' || 
        typeof req.body.nickname !== 'string'
        ) {
            return res.status(400).json({
                message: "Bad request",
            });
    }

    // create the user object
    let user = new User();
    user.provider = req.body.provider;
    user.providerid = req.body.providerid;
    user.nickname = req.body.nickname;

    user.save(function (err) {
                
        // something wrong with mongodb
        if (err) {
            //if the error is that the nickname is taken, return the error
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(409).json({ message: 'User already exists' });
            }
            // if the error is something with the validation (e.g. wrong provider)
            if(err.name === 'ValidationError'){
                return res.status(400).json({ message: 'Error in validation' });
            }
            // return any other errors
            return res.status(500).send(err);
        }

        // create a new token
        const token = jwt.sign(
            { 
                nickname: user.nickname // save the nickname as token payload
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // save the token to redis db, expire in 24h, like the JWT
        redisClient.set(token, JSON.stringify(user), 'EX', 24 * 3600);

        // set a cookie for the client, so it already have the token in the browser cookies
        res.cookie('access_token', token, {
            maxAge: 1000 * 3600 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
            signed: true // Indicates if the cookie should be signed
        });

        // return the JWT token for the future API calls
        res.status(200).json({
            message: 'Authentication successful!',
            accesstoken: token
        });

    });
    

};

// Handle signup action
exports.update = function (req, res) {

    //validation, user can update only himself
    if ( res.locals.user._id !== req.params.user_id ){
        return res.status(403).json({ message: "Not authorized" });
    }

    // user is authorized, so update
    User.findById(req.params.user_id, function (err, user) {
        
        // something wrong with mongodb
        if (err) return res.status(500).send(err);
        
        // if any field is passed, update them
        if ( typeof req.body.nickname !== 'undefined' ) {
            user.set({ nickname: req.body.nickname });
        }
        if ( typeof req.body.email !== 'undefined' ) {
            user.set({ email: req.body.email });
        }
        if ( typeof req.body.phone !== 'undefined' ) {
            user.set({ phone: req.body.phone });
        }

        // save and return the user and check for errors
        user.save(function (err, updatedUser) {
            // something wrong with mongodb or validation failed
            if (err) {
                //if the error is that the nickname is taken, return the error
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(409).json({ message: 'Nickname already taken' });
                }
                return res.status(500).send(err);
            }
            return res.status(200).json({
                message: 'User updated',
                data: updatedUser
            });
        });
    }); 

};
