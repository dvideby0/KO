/**
 * Created with JetBrains PhpStorm.
 * User: Richard Brookfield
 * Date: 7/7/13
 * Time: 12:28 AM
 */

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
    console.log(req.body);
    res.send(200);
});

app.listen(8867);