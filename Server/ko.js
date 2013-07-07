/**
 * Created with JetBrains PhpStorm.
 * User: Richard Brookfield
 * Date: 7/7/13
 * Time: 12:28 AM
 */

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var registration;
new mongodb.Db('ko2013', server, {w:1}).open(function (error, client) {
    if (error) throw error;
    registration = new mongodb.Collection(client, 'registration');
});



var express = require('express');
var app = express();
app.use(express.bodyParser());

app.all('*', function(req, res, next){
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

app.post('/', function(req, res){
    registration.findOne({email: req.body.email}, function(err, post){
        if(!post){
            registration.insert(req.body, function(){
                console.log('A User Has Registered...');
                res.send(200, 'Registration Successful!');
            });
        }
        else{
            res.send(200, 'User Already Exists!');
        }
    });
});

app.listen(8867);