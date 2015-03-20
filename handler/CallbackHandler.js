/**
 * CallbackHandler.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Handler = require('./Handler');
var _ = require('lodash');
var util = require('util');

/**
 * Wrapper for Closures passed as handlers. Can be used
 * directly, or will be instantiated automagically by Ouch
 * if passed to ouchInstance.pushHandler
 *
 * @param {function} callable
 * @constructor
 * @throws TypeError if argument is not callable
 */
function CallbackHandler(callable) {
    CallbackHandler.super_.call(this);

    if (!_.isFunction(callable)) {
        throw new TypeError(
            'Argument  must be valid callable'
        );
    }

    this.__callable = callable;
}

util.inherits(CallbackHandler, Handler);

/**
 * @param next
 */
CallbackHandler.prototype.handle = function (next) {
    this.__callable.call(null, next, this.getException(), this.__inspector, this.__run,
        this.__request, this.__response);
};

module.exports = CallbackHandler;