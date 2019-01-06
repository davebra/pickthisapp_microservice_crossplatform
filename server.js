let dotenv = require('dotenv').config(); // library for manage .env variables
let express = require('express'); // nodejs webserver
let bodyParser = require('body-parser'); // library for parse body requests
let busboyBodyParser = require('busboy-body-parser'); //library for parse multipart form req
let mongoose = require('mongoose'); // library for mongodb through nodejs
let apiRoutes = require("./routes"); // import routes

// create express app
let app = express();

// allow cors from localhost
app.all('*', function(req, res, next) {
    var origin = req.get('origin'); 
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(busboyBodyParser({ 
    limit: '5mb'
}));

// Connect to Mongoose and set connection variable
mongoose.connect(
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/pickthisapp', {useNewUrlParser: true});
var db = mongoose.connection;

// Setup server port
var port = process.env.PORT || 3000;

// Send message for default URL
app.get('/', (req, res) => res.send('Pick This App server'));

// Use Api routes in the App
app.use('/api', apiRoutes)

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running Rest API on port " + port);
});