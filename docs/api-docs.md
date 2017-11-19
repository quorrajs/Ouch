# API Documentation

### Core Classes:
- [`ouch\Ouch`](#ouchouch) - The main `Ouch` class - represents the stack and current execution
- [`ouch\handler\Handler`](#ouchhandlerhandler) - Abstract representation of a Handler, and utility methods
- [`ouch\exception\Inspector`](#ouchexceptioninspector) - Exposes methods to inspect an exception

### Core Handlers:
- [`ouch\handler\CallbackHandler`](#ouchhandlercallbackhandler) - Wraps callables as handlers
- [`ouch\handler\PrettyPageHandler`](#ouchhandlerprettypagehandler) - Outputs a detailed, fancy error page
- [`ouch\handler\JsonResponseHandler`](#ouchhandlerjsonresponsehandler) - Formats errors and exceptions as a JSON payload

# Core Classes

## ouch\Ouch

The `Ouch` class models an instance of an execution, and integrates the methods to control ouch' execution in that context, and control the handlers stack.

### Static Properties

```javascript
// It is an object which exposes , Handler class(as BaseHandler - which should be used for
// creating any custom handler) and all the default error handler classes.
Ouch.handler
```

### Methods

```javascript
// Pushes a new handler to the stack of handlers
pushHandler(handler)
 #=> ouch instance

// Pops and returns the last handler from the stack
popHandler()
 #=> popped handler

// Returns all handlers in the stack
getHandlers()
 #=> array of handlers

// Returns a Inspector instance for a given Exception
__getInspector(exception)
 #=> an instance of ouch\exception\Inspector

// Handles an exception with the current stack. Provided callback will be executed
// when once execution of error handlers completes or when one of the handler sends
// quit signal with output from each handler as an array.
handleException(exception, request, response, callback)
```

## ouch\handler\Handler

This abstract class contains the base methods for concrete handler implementations. All Custom handlers should extend
it with the help of node's util.inherits method like below. This class is exposed through [`ouch\Ouch`](#ouch) class's
static property named handlers along with other default handlers for ease of access.

```javascript

    var Ouch = require('ouch');
    var util = require('util');

    function MyCustomHandler() {
        MyCustomHandler.super_.call(this);
        ...
        // define handler specific properties here.
        ...
    }

    util.inherits(MyCustomHandler, Ouch.handlers.BaseHandler);

    // define or modify MyCustomHandler's prototypes like:
    // MyCustomHandler.prototype.customMethod = function(){}
    // MyCustomHandler.prototype.handle = function(){}

    module.exports = MyCustomHandler;

```
### Static Properties

```javascript
// It is used to signal Ouch.handleException method from handler
// to quit during exception handling.
Handler.QUIT
```

### Methods

```javascript
// This method will be called once an exception needs to be handled. A next
// argument will be passed to the handle method which is a callback and should be
// executed with the output(if any) from the handler.The execution of the next
// argument provided will lead to the execution of remaining handlers in the
// stack and finally provided callback to the ouch.handleException method.
handle(next)


// Sets the Ouch instance to the property __run
setRun(ouch)

// Sets the Inspector instance to the property __inspector
setInspector(inspector)

// Sets the http request to the property __request
setRequest(request)

// Sets the http response to the property __response
setResponse(Response)

// returns the output from `inspector.getException()`
getException()
```

## ouch\exception\Inspector

The `Inspector` class provides methods to inspect an exception instance, with particular focus on its frames/stack-trace.

### Methods

```javascript
// Inspector must be instantiated with error object as argument.
__construct(exception)
 #=> Inspector instance

// Returns the exception object being inspected
getException()
 #=> exception

// Returns the string name of the exception being inspected
getExceptionName()
 #=> string

// Returns the string message of the exception being inspected
getExceptionMessage()
#=> string

// Returns an array of CallSite objects generated from error stack
// property with the help of node-stack-trace module for the
// error being inspected.
getFrames()
 #=> Array
```

# Core Handlers

## ouch\handler\CallbackHandler
The CallbackHandler handler wraps regular callbacks as valid handlers. Useful for quick prototypes or simple handlers. When you pass a closure to `ouchInstance.pushHandler`, it's automatically converted to a CallbackHandler instance

```javascript

ouchInstance.pushHandler(function(next, exception, inspector, run, req, res) {
    console.log(inspector.getExceptionName());
    next();
});

ouchInstance.popHandler() // #=> ouch\handler\CallbackHandler
```

### Methods

```javascript
// Accepts any valid callback function
__construct(callable)

// executes callable set during handler instantiation with arguments
// exception, inspector, run, request and response.
handle(next)
```

## ouch\handler\PrettyPageHandler

The `PrettyPageHandler` generates a fancy, detailed error page which includes code views for all frames in the stack trace, environment details, etc. Super neat. It produces a bundled response string that does not require any further HTTP requests, so it's fit to work on pretty much any environment and framework that speaks back to a browser, without you having to explicitly hook it up to your framework/project's routing mechanisms.

### Methods

```javascript
// PrettyPageHandler accepts `theme`, `pageTitle`, `editor`, `sendResponse` and
// `additionalScripts' as its arguments during instantiation.
// @param theme can be any of `blue` or `orange` which sets the PrettyPageHandler's theme
// theme will be set to blue when no value or null is provided.
//
// @param PageTitle sets the page title of the pretty error page.
// Page title will set to default title when no value or null is provided
//
// @param editor set the editor to use to open referenced files, by a string
// identifier, or a callable that will be executed for every
// file reference, with a file and line argument, and should return a string.
// Opening file reference in an editor will be disabled when no value or null is
// provided.
//
// @param sendResponse is a boolean value which will determine whether handler response
// should be sent as http response or not. It will be set to true when no value is provided.
//
// @param additionalScripts is an optional array of urls that represent additional
// javascript resources to include in the rendered template.
__construct(theme, pageTitle, editor, sendResponse, additionalScripts)
 #=> PrettyPageHandler instance

// Sets an editor to use to open referenced files, either by
// a string identifier, or as an arbitrary callable that returns
// a string that can be used as an href attribute.
// Available built-in editors are:
// - sublime
// - emacs
// - textmate
// - macvim
setEditor(editor)
setEditor(function (file, line) { return string })

// Similar to setEditor, but allows you to name your custom editor,
// thus sharing it with the rest of the application. Useful if, for example,
// you integrate ouch into your framework or library, and want to share
// support for extra editors with the end-user.
//
// resolver may be a callable, like with setEditor, or a string
// with placeholders %file and %line.
// For example:
// handler.addEditor('whatevs', 'whatevs://open?file=file://%file&line=%line')
addEditor(editor, resolver)

// If sendResponse is true and http response object is set handle method will
// send a pretty error page to the client and signal ouch to stop execution
// of remaining handlers. If sendResponse is set to false or http response object
// is empty pretty error page content will be passed to next callback without
// signaling to quit the execution.
handle(next)
```

## ouch\handler\JsonResponseHandler

The `JsonResponseHandler`, upon receiving an exception to handle, simply constructs a JSON payload, and outputs it. Methods are available to control the detail of the output, and if it should only execute for AJAX and WantsJson requests - paired with another handler under it, such as the PrettyPageHandler, it allows you to have meaningful output for both regular and AJAX/WantsJson requests. Neat!

```javascript
// JsonResponseHandler accepts `onlyForAjaxOrJsonRequests`, `returnFrames`,
// and `sendResponse` as its arguments during instantiation.
// @param onlyForAjaxOrJsonRequests is boolean which determines
// whether to process errors of all request types or whether to process
// errors from Ajax/WantsJson type request. It is set to false by default.
//
// @param returnFrames is boolean which determines whether to include
// stack trace details object to the output. It is set to false by default.
//
// @param sendResponse is a boolean value which will determine whether handler response
// should be sent as http response or not. It will be set to true when no value is provided.
// It is set to true  by default.
__construct(onlyForAjaxOrJsonRequests, returnFrames, sendResponse)
 #=> JsonResponseHandler instance

// If sendResponse is true and http response object is set handle method will
// send a created JSON payload to the client and signal ouch to stop execution
// of remaining handlers. If sendResponse is set to false or http response object
// is empty created JSON payload content will be passed to next callback without
// signaling to quit the execution.
handle(next)
```
