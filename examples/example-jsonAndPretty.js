/**
 * example-jsonAndPretty.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 *
 * Run this example with node >= 0.10.0
 * $ cd project_dir/examples
 * $ npm install ouch
 * $ node example-jsonAndPretty.js
 *
 * Now access http://localhost:3000 through your browser and see response returned by PrettyPageHandler.
 * and request http://localhost:3000 via some REST client with header X-Requested-With => xmlhttprequest
 * or Accept => application/json and see response returned by JsonResponseHandler.
 */

var http = require('http');
var domain = require('domain');
var Ouch = require('ouch');

http.createServer(function app(req, res){

    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }

    var d = domain.create();

    d.on('error', function(e){
            (new Ouch)
            .pushHandler((new Ouch.handlers.JsonResponseHandler(
                    /*handle errors from ajax and json request only*/true,
                    /*return formatted trace information along with error response*/true
                )))
            .pushHandler(new Ouch.handlers.PrettyPageHandler())
            .handleException(e, req, res, function () {
                console.log('Error handled properly')
            });
    });
    d.run(function(){

        // your application code goes here

        // this will throw error
        console.log(i);

        res.writeHead(200);
        res.end("hello world!");

    });

}).listen(3000, 'localhost');
