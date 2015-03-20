/**
 * example-comments.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 *
 * Run this example with node >= 0.10.0
 * $ cd project_dir/examples
 * $ npm install ouch
 * $ node example-comments.js
 *
 * Now access http://localhost:3000 through your browser and see response returned by PrettyPageHandler with comments.
 */

var http = require('http');
var domain = require('domain');
var Ouch = require('../Ouch');

http.createServer(function app(req, res) {

    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end();
        return;
    }

    var d = domain.create();

    d.on('error', function (e) {
        (new Ouch)
            // Tag all frames inside a function with their function name
            .pushHandler(function (next, exception, inspector, run, req, res) {
                inspector.getFrames().map(function (frame) {
                    var functionName = frame.getMethodName();
                    if (functionName) {
                        frame.addComment("This frame is within function " + functionName, "My comments");
                    } else {
                        frame.addComment("This frame is within an <#anonymus> function", "My comments");
                    }
                    return frame;
                });
                next();
            })
            .pushHandler(new Ouch.handlers.PrettyPageHandler())
            .handleException(e, req, res, function () {
                console.log('Error handled properly')
            });
    });
    d.run(function () {

        // your application code goes here

        // this will throw error
        console.log(i);

        res.writeHead(200);
        res.end("hello world!");

    });

}).listen(3000, 'localhost');
