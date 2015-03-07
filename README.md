Ouch
====

NodeJS errors for cool kids

-----

![Ouch!](http://i.imgur.com/EPXL1Zq.png)

**Ouch** is a NodeJS implementation of PHP's [Whoops](https://github.com/filp/whoops) library. It's not a exact port of
Whoops, but implements similar functionality and uses same front end resources in some of its error handlers. It is an
error handler base/framework for NodeJs. Out-of-the-box, it provides a pretty error interface that helps you debug your
web projects, but at heart it's a simple yet powerful stacked error handling system.

[PrettyPageHandler demo](https://quorrajs.github.io/ouch/demo)

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
            var ouchInstance = (new Ouch).pushHandler(new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime'));
            ouchInstance.handleException(e, req, res, function (output) {
                console.log('Error handled properly')
            });
        });
        d.run(function(){

                ....
                ....

        });

    }).listen('1338', 'localhost');

    // With custom handler

    var ouchInstance = (new Ouch).pushHandler(function(next, exception, request, response){
        ...
        ...
    });

    ouchInstance.handleException(e, req, res, function (output) {
        console.log('Error handled properly')
    });
```


## Todo

    - Add more handlers.