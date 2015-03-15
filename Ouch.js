/**
 * Ouch.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Inspector = require('./exception/Inspector');
var _ = require('lodash');
var PrettyPageHandler = require('./handler/PrettyPageHandler');
var JsonResponseHandler = require('./handler/JsonResponseHandler');
var Handler = require('./handler/Handler');

/**
 * @param {Array} handlerStack
 * @constructor
 */
function Ouch(handlerStack) {
    /**
     * Stores error handlers
     * @var {Array} handlerStack
     * @protected
     */
    this.__handlerStack = handlerStack || [];
}

/**
 * Error handler classes
 *
 * @type {{PrettyPageHandler: (PrettyPageHandler)}}
 */
Ouch.handlers = {
    BaseHandler: Handler,
    PrettyPageHandler: PrettyPageHandler,
    JsonResponseHandler: JsonResponseHandler
};

/**
 * Returns an array with all handlers, in the order they were added to the stack.
 *
 * @returns {Array}
 */
Ouch.prototype.getHandlers = function () {
    return this.__handlerStack;
};

/**
 * Pushes a handler to the end of the stack.
 *
 * @throws TypeError  If argument is not callable or instance of HandlerInterface
 * @param handler
 * @returns {Ouch}
 */
Ouch.prototype.pushHandler = function (handler) {
    if (_.isFunction(handler) || _.isFunction(handler.handle)) {
        this.__handlerStack.push(handler);
    } else {
        throw new TypeError("Argument must be a callable, or object should have method 'handle'")
    }
    return this;
};

/**
 * Removes the last handler in the stack and returns it.
 * Returns undefined if there"s nothing else to pop.
 * @returns {function|Object|undefined}
 */
Ouch.prototype.popHandler = function () {
    return this.__handlerStack.pop();
};

/**
 * Clears all handlers in the handlerStack.
 *
 * @returns {Ouch}
 */
Ouch.prototype.clearHandlers = function () {
    this.__handlerStack = [];
    return this;
};

/**
 * @param  {Error|String|Object} exception
 * @returns Inspector
 * @protected
 */
Ouch.prototype.__getInspector = function (exception) {
    return new Inspector(exception);
};

/**
 * Handles an exception, ultimately generating a Ouch error
 * page. Responses from each handler will be pushed into an array
 * and will be sent along to the callback if present as first argument.
 *
 * @param  {Error} exception
 * @param  {function} CB
 * @param  {Object} request
 * @param  {Object} response
 */
Ouch.prototype.handleException = function (exception, request, response, CB) {
    if (!request) {
        request = null;
    }

    if (!response) {
        response = null;
    }

    if (!CB) {
        CB = null;
    }

    (function (inspector, handlerStack, self) {
        var output = [];

        function next(handleResponse) {
            output.push(handleResponse);

            if ((arguments.length > 1 && arguments[1] === Handler.QUIT) || !handlerStack.length) {
                if (CB) {
                    CB(output.slice(1));
                }
            } else {
                var handler = handlerStack.shift();

                if (handler instanceof Handler) {
                    handler.setRun(self);
                    handler.setInspector(inspector);
                    handler.setRequest(request);
                    handler.setResponse(response);
                    handler.handle(next, exception);
                } else {
                    handler(next, exception, request, response)
                }
            }
        }

        next();
    })(this.__getInspector(exception), this.__handlerStack.slice(0), this)
};

module.exports = Ouch;