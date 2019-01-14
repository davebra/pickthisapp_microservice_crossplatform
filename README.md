## PickThisApp Rest-API Service

Rest API server application for PickThisApp, project for the Cross Platform subject, Bachelor of IT @ AIT Melbourne.

Copyright &copy; Davide Bragagnolo

The RestAPI service is intented to use in conjunction with the app [PickThisApp React Native](https://github.com/davebra/pickthisapp_react_crossplatform) 

### Components of the RestAPI Service

* Express.js - the web server to anwser get/post requests
* MongoDB - the main NoSQL database
* Redis - used as authentications database, to store tokens with user objects
* JWT - JSON Web Tokens, token generator, managed with cookies
* Mongoose - MongoDB Node.js library
* Amazon AWS - Optionally, is possible to upload pictures in a S3 bucket
* body-parser, busboy-body-parser - parse of the body content of the requests
* dotenv - for manage environment variables with .env files or PaaS setting

### RestAPI documentation

API documentation at: *coming soon*

### Demo and start locally

Demo environment running at: `https://pickthisapp.herokuapp.com/`

Local server starts at: `http://localhost:3000/` the port 3000 can be changed in the `.env` file

##### Requirements for work locally

* Node.js
* Docker + Docker Compose
* (optional) an AWS account with S3 access and secret keys

##### Start the server locally

1) Clone the repository `git clone https://github.com/davebra/pickthisapp_microservice_crossplatform.git`

2) Enter the folder and install npm dependecies `npm install`

3) create the file `.env` using the template `env.sample` (no need to change any  values to work locally)

4) Start the mongodb & redis servers with docker compose `docker-compose up -d` (this load also demo content)

5) Start the server with `npm start` (or `npm run dev` to start with nodemon, that reload the server if any changes are made to the js files)
