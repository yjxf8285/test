/**
 * Created by liuxiaofan on 2017/3/20.
 */
var express = require('express');
var http = require('http');
var app = express();
app.use('/', function (req,res) {
    // res.set('Content-type','text/plain');
    res.send('abc')
});
app.post('/users/api', function (req,res) {
    // res.set('Content-type','text/plain');
    res.send('abc')
});
app.post('/', function (req, res) {
    res.send('POST request to homepage');
});
var server = http.createServer(app);
server.listen(3000);