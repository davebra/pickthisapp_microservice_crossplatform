const dotenv = require('dotenv').config(); // library for manage .env variables
const express = require('express'); // nodejs webserver
const cors = require('cors'); // set the appropriate CORS
const bodyParser = require('body-parser'); // library for parse body requests
const cookieParser = require('cookie-parser'); // library for parse cookies
const mongoose = require('mongoose'); // library for mongodb through nodejs
const apiRoutes = require("./routes"); // import routes

// create express app
const app = express();

// Connect to Mongoose and set connection variable
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
const db = mongoose.connection;

// allow cors from everywhere, for dev purpouses
app.use(cors({ allowedHeaders: 'Origin, Access-Control-Allow-Headers, Authorization, X-Requested-With, Content-Type, Cache-Control, Accept' }));
app.options('*', cors());  // enable pre-flight

// Configure express to handle cookies
app.use(cookieParser(process.env.COOKIES_SECTRET));

// Configure express to handle post requests with json body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));

// Setup server port
const port = process.env.PORT || 3000;

// Send message for default URL
app.get('/', (req, res) => res.send('PickThisApp RestAPI Server'));

// Use Api routes in the App
app.use('/api', apiRoutes);

// If we are not using AWS-S3, create a resource to permits the files uploaded in /upload folder
if( process.env.AWS_S3_REGION === 'local' ){
    app.use('/uploads', express.static('uploads'));
}
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running Rest API on port " + port);
});