/**
 * JsonResponseHandler.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Handler = require('./Handler');
var formatter = require('../exception/formatter');
var util = require('util');
var _ = require('lodash');


/**
 * Catches an exception and converts it to a JSON
 * response. Additionally can also return exception
 * frames for consumption by an API.
 */
function JsonResponseHandler(onlyForAjaxOrJsonRequests, returnFrames, sendResponse) {
    JsonResponseHandler.super_.call(this);

    /**
     * Should Ouch push output directly to the client?
     * If this is false, output will be passed to the callback
     * provided to the handle method.
     *
     * @type {boolean}
     * @protected
     */
    this.__sendResponse = sendResponse === undefined ? true : Boolean(sendResponse);

    /**
     * @var {boolean}
     * @protected
     */
    this.__returnFrames = returnFrames ? Boolean(returnFrames) : false;

    /**
     * If this is true handler will process this error if and only
     * if request is ajax or request accepts json.
     *
     * @var {boolean}
     * @protected
     */
    this.__onlyForAjaxOrJsonRequests = onlyForAjaxOrJsonRequests ? Boolean(onlyForAjaxOrJsonRequests) : false;
}

util.inherits(JsonResponseHandler, Handler);

/**
 * Check, if possible, that this execution was triggered by an AJAX request.
 *
 * @return bool
 * @protected
 */
JsonResponseHandler.prototype.__isAjaxRequest = function () {
    if (this.__request) {
        return (
        !_.isEmpty(this.__request.headers['x-requested-with'])
        && (this.__request.headers['x-requested-with']).toLowerCase() == 'xmlhttprequest');
    }
};

/**
 * Check, whether request content type is JSON.
 *
 * @return bool
 * @protected
 */
JsonResponseHandler.prototype.__wantsJson = function () {
    if (this.__request) {
        return (
        !_.isEmpty(this.__request.headers['accept'])
        && (this.__request.headers['accept']).toLowerCase() == 'application/json');
    }
};

/**
 * @return int
 */
JsonResponseHandler.prototype.handle = function (next) {
    if (this.__onlyForAjaxOrJsonRequests && !(this.__isAjaxRequest() || this.__wantsJson())) {
        next();
    } else {

        var output = {
            'error': formatter.formatExceptionAsDataArray(
                this.__inspector,
                this.__returnFrames
            )
        };

        if (this.__response && this.__sendResponse) {
            if (!this.__response.headersSent) {
                this.__response.writeHead('Content-Type: application/json');
            }

            this.__response.end(JSON.stringify(output));

            next(null, Handler.QUIT);
        } else {
            next(JSON.stringify(output));
        }
    }
};

module.exports = JsonResponseHandler;
