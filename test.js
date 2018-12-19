//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/pickthisapp';

var connectingDb; // promise

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

init();

module.exports = {
    isConnected: isConnected
}

// Use connect method to connect to the Server
function init() {
  connectingDb = new Promise(
    function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
          reject(err);
        }
        else {
          console.log('Connection established to', url);

          //Close connection
          //db.close();
          resolve(db);
        }
      });

    }
  );
}

function getDbObject() {
  return connectingDb().then(myDb => {
                                       return {
                                          connected: true,
                                          db: myDb
                                        }
                                      }
                              )
                       .catch(err =>  {
                                        return {
                                          connected: false,
                                          db: err
                                        }
                                      }
                             )
}

function isConnected() {
    return new Promise(
        function(resolve, reject) {
          var obj = getDbObject();
          if (obj.connected == true) {
            console.log('success');
            resolve(true);
          }
          else {
            console.log('error');
            reject(false);
          }
        }
    )

}