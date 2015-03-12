/**
 * example-express.js
 *
 * @author: Harish Anchu <twitter:@harishanchu>
 * Copyright (c) 2015, Harish Anchu. All rights reserved.
 */

var express = require('express');
var Ouch = require('ouch');

var app = express();

app.get('/', function(req, res){
  // this will throw error;
  console.log(i);
  res.send('hello world');
});

app.use(function(req, res, next){
	throw new Error("Not found");
});

app.use(function(err, req, res, next){
	(new Ouch()).pushHandler(
        new Ouch.handlers.PrettyPageHandler()
    ).handleException(err, req, res,
        function(){
            console.log('Error handled')
        }
    );
});

app.listen(3000);
