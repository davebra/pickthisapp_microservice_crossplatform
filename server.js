let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();

let apiRoutes = require("./routes")

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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