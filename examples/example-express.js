/**
 * example-express.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 *
 * Run this example with node >= 0.10.0
 * $ cd project_dir/examples
 * $ npm install express ouch
 * $ node example-express.js
 *
 * and access http://localhost:3000 through your browser.
 *
 */

var express = require('express');
var Ouch = require('ouch');

var app = express();

app.get('/', function (req, res) {
    // this will throw error;
    console.log(i);
    res.send('hello world');
});

app.use(function (req, res, next) {
    throw new Error("Not found");
});

app.use(function (err, req, res, next) {
    (new Ouch()).pushHandler(
        new Ouch.handlers.PrettyPageHandler()
    ).handleException(err, req, res,
        function () {
            console.log('Error handled');
        }
    );
});

app.listen(3000);
