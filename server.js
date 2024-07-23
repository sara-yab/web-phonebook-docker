var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
const recordRoutes = express.Router();
var app = express();
app.use(bodyParser());

var connectionString = "mongodb://adminmongo:password@localhost:27017";

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, "phonebook.html"));


});


app.get("/users", (req, res) => {
    MongoClient.connect(connectionString, function (err, client) {
        if (err) throw err;

        var db = client.db('user_account');

        db.collection('users').find({}).limit(50)
            .toArray(function (err, result) {
                if (err) {
                    res.status(400).send("Error fetching listings!");
                } else {
                    res.json(result);
                }
            });

    });
})


app.post("/createUser", (req, res) => {
    var response = res;
    console.log((req));

    MongoClient.connect(connectionString, function (err, client) {
        if (err) throw err;

        var db = client.db('user_account');
        db.collection('users').insertOne(req.body)
            .then(result => {
                response.send(result);
            })
            .catch(error => console.error(error))

    });
})

app.delete("/deleteUser", (req, res) => {
    var response = res;

    console.log((req));

    MongoClient.connect("mongodb://adminmongo:password@localhost:27017", function (err, client) {
        if (err) throw err;
  
        var db = client.db('user_account');
        const ObjectId = require('mongodb').ObjectID;
        console.log(req.body.id);
      

        db.collection('users').deleteOne(
            { _id: ObjectId(req.body.id) },
            {}
          ).then(result => {
                response.send(result);
            })
            .catch(error => console.error(error))

    });
})


app.post("/findUser", (req, res) => {
    var response = res;
    console.log((req.body.name));

    MongoClient.connect(connectionString, function (err, client) {
        if (err) throw err;

        var db = client.db('user_account');
        
        db.collection('users').find( { name : new RegExp('.*' + req.body.name + '.*') } )
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
         });
    })
})


app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
    console.log("teeeest 3000")
});