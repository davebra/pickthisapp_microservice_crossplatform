const redis = require('redis'); // redis DB library
const jwt = require('jsonwebtoken'); // JavascriptWebToken Library

// Connect to Redis to store/get token data
const redisClient = redis.createClient( process.env.REDIS_URL );
redisClient.on("error", function (err) {
    console.log("Error " + err);
});

// Handle auth action
exports.auth = function (req, res, next) {

    // get the token from the cookies or the authorization header
    let token = req.signedCookies['access_token'] || req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {

        // if token is in the header, with Bearer, remove the Bearer string
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // verify if is a valid token for this server
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {

            // if not a valid token, remove cookie and send error message
            if (err) {
                res.clearCookie("access_token");
                return res.status(401).json({
                    message: 'Token is not valid'
                });
            }

            // get logged user data from Redis
            redisClient.get(token, function (error, loggedUser) {

                // if token key in redis is not found (e.g. exired or malicious attempt), remove cookie and send error
                if (error || loggedUser == null) {
                    res.clearCookie("access_token");
                    return res.status(401).json({
                        message: 'Token is not valid'
                    });
                }

                // if is valid, save the user data from redis in a object of the res
                res.locals.user = JSON.parse(loggedUser);
                next(); // go to next function

            });

        });

    } else {

        // token is not supplied, send error message
        return res.status(401).json({
            message: 'Token not supplied'
        });

    }

};