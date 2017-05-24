var dotenv = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

require('./routes.js')(app);

var port = process.env.PORT || 3000;
app.listen(port);