/**
 * Used to inspect a javascript error.
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var stackTrace = require('stack-trace');
var frameModifier = require('./frame');

/**
 * Exception inspector
 *
 * @param exception
 * @constructor
 */
function Inspector(exception) {
    /**
     * @protected
     */
    this.__exception = exception;

    /**
     * @protected
     */
    this.__frames;

    /**
     * @protected
     */
    this.__code;
}

/**
 * Returns an array of modified CallSite object returned by stack-trace module.
 *
 * @returns {Array|undefined}
 */
Inspector.prototype.getFrames = function () {
    if (!this.__frames) {
        this.__frames = stackTrace.parse(this.__exception).map(function (frame) {
            return frameModifier(frame);
        });
    }
    return this.__frames;
};

/**
 * Returns http status code for the error.
 *
 * @returns {*}
 */
Inspector.prototype.getCode = function () {
    return this.__code ? this.__code : (!this.__exception.status ||
    this.__exception.status < 400 ? 500 : (this.__exception.status || 500));
};

/**
 * @returns {*}
 */
Inspector.prototype.getException = function () {
    return this.__exception;
};

/**
 * @returns {String}
 */
Inspector.prototype.getExceptionName = function () {
    return this.__exception.name ? this.__exception.name : "Error thrown";
};

/**
 * @returns {String}
 */
Inspector.prototype.getExceptionMessage = function () {
    return this.__exception.message ? this.__exception.message : "";
};

module.exports = Inspector;