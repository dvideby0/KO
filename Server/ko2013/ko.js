/**
 * Created with JetBrains PhpStorm.
 * User: Richard Brookfield
 * Date: 7/7/13
 * Time: 12:28 AM
 */

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var participants;
var teams;
new mongodb.Db('ko2013', server, {w:1}).open(function (error, client) {
    if (error) throw error;
    participants = new mongodb.Collection(client, 'participants');
    teams = new mongodb.Collection(client, 'teams');
});

var json2csv = require('json2csv');

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
    participants.findOne({email: req.body.email}, function(err, post){
        if(!post){
            teams.findOne({'team-name': req.body['team-name'].toLowerCase()}, function(err, post2){
                if(!post2){
                    teams.insert({'team-name': req.body['team-name'].toLowerCase(), 'members': [req.body['first-name'] + ' ' + req.body['last-name']]}, function(){
                        participants.insert(req.body, function(){
                            res.send(200, 'Registration Successful!');
                        });
                    });
                }
                else{
                    if(post2.members.length == 5){
                        res.send(200, 'This Team Is Full. Please Register For a Different Team.');
                    }
                    else{
                        teams.update({'team-name': req.body['team-name'].toLowerCase()}, { $push: {members: req.body['first-name'] + ' ' + req.body['last-name']}}, function(){
                            participants.insert(req.body, function(){
                                res.send(200, 'Registration Successful!');
                            });
                        });
                    }
                }
            });
        }
        else{
            res.send(200, 'User Already Exists!');
        }
    });
});

app.get('/teams-list', function(req, res){

    teams.find({}, {_id:0}).toArray(function(err, array){
        array.forEach(function(item){
            item.members = item.members.toString();
        });
        json2csv({data: array, fields: ['team-name', 'members']}, function(err, csv) {
            if(err){
                console.log(err);
            }
            else{
                res.attachment('teams-list.csv');
                res.end(csv, 'UTF-8');
            }
        });
    });
});

app.get('/participants-list', function(req, res){
    participants.find({}, {_id:0}).toArray(function(err, array){
        json2csv({data: array, fields: ['first-name', 'last-name', 'cu-name', 'email', 'shirt-size', 'dietary-requirements']}, function(err, csv) {
            if(err){
                console.log(err);
            }
            else{
                res.attachment('participants-list.csv');
                res.end(csv, 'UTF-8');
            }
        });
    });
});

app.listen(8867);