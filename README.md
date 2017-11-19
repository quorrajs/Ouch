Ouch
====

NodeJS errors for cool kids

[![npm version](https://badge.fury.io/js/ouch.svg)](http://badge.fury.io/js/ouch)
[![Build Status](https://travis-ci.org/quorrajs/Ouch.svg?branch=master)](https://travis-ci.org/quorrajs/Ouch)
[![Quality](https://codeclimate.com/github/quorrajs/Ouch/badges/gpa.svg)](https://codeclimate.com/github/quorrajs/Ouch)
[![Documentation Status](https://readthedocs.org/projects/ouch/badge/?version=latest)](https://readthedocs.org/projects/ouch/?badge=latest)

-----

![Ouch!](http://i.imgur.com/EPXL1Zq.png)

**Ouch** is a NodeJS implementation of PHP's [Whoops](https://github.com/filp/whoops) library. It's not an exact port of
Whoops, but implements similar functionality and uses same front end resources in some of its error handlers. It is an
error handler base/framework for NodeJs. Out-of-the-box, it provides a pretty error interface that helps you debug your
web projects, but at heart it's a simple yet powerful stacked error handling system.

### Pretty page handler demo

[Blue theme](https://quorrajs.github.io/Ouch/demo/)

[Orange theme](https://quorrajs.github.io/Ouch/demo/orange.html)

## Installation

The source is available for download from [GitHub](https://github.com/quorrajs/Ouch). Alternatively, you
can install using Node Package Manager (npm):

```javascript
npm install ouch
```

## Usage examples

``` javascript
    // With PrettyPageHandler
    http.createServer(function nsjfkj(req, res){

        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            return;
        }

        var d = domain.create();

        d.on('error', function(e){
            var ouchInstance = (new Ouch).pushHandler(
                    new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
                );
            ouchInstance.handleException(e, req, res, function (output) {
                console.log('Error handled properly')
            });
        });
        d.run(function(){

            // your application code goes here

        });

    }).listen('1338', 'localhost');


    // With custom callback
    var ouchInstance = (new Ouch).pushHandler(
        function(next, exception, inspector, run, request, response){

            // custom handler logic

            next();
        });

    ouchInstance.handleException(e, req, res, function (output) {
        console.log('Error handled properly')
    });
```

For more options, have a look at the example files in examples to get a feel for how things work. Also take a look at the [API Documentation](http://ouch.readthedocs.org/en/latest/api-docs/) and the list of available handlers below.

### Available Handlers

**Ouch** currently ships with the following built-in handlers, available in the `require("ouch").handlers` namespace:

- [`PrettyPageHandler`](https://github.com/quorrajs/Ouch/blob/master/handler/PrettyPageHandler.js) - Shows a pretty error page when something goes pants-up
- [`JsonResponseHandler`](https://github.com/quorrajs/Ouch/blob/master/handler/JsonResponseHandler.js) - Process errors and returns information on them as a JSON string.
- [`CallbackHandler`](https://github.com/quorrajs/Ouch/blob/master/handler/CallbackHandler.js) - Wraps a callable as a handler. You do not need to use this handler explicitly, Ouch will automatically wrap any callable you pass to `ouchInstance.pushHandler`.

## Todo

    - Add more handlers.

## License

Ouch is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
