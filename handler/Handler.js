/**
 * Abstract implementation of a error handler.
 *
 * @class
 * @abstract
 * @author: Harish Anchu <twitter:@harishanchu>
 * Copyright (c) 2015, Wimoku Pvt Ltd. All rights reserved.
 */
function Handler() {
    if (this.constructor === Handler) {
        throw new Error("Can't instantiate abstract class!");
    }

    /**
     * @var {Object}
     * @protected
     */
    this.__inspector;

    /**
     * @var {Object}
     * @protected
     */
    this.__run;

    /**
     * @var {Object}
     * @protected
     */
    this.__request = null;

    /**
     * @var {Object}
     * @protected
     */
    this.__response = null;
}

/**
 * Handles the error
 *
 * @param {function} next
 */
Handler.prototype.handle = function (next) {
    next();
};

/**
 * @param {Object} run
 */
Handler.prototype.setRun = function (run) {
    this.__run = run || null;
};

/**
 * @param {Object} inspector
 */
Handler.prototype.setInspector = function (inspector) {
    this.__inspector = inspector;
};

/**
 * @param request
 * @returns {Handler}
 */
Handler.prototype.setRequest = function (request) {
    this.__request = request;
    return this;
};

/**
 * @param response
 * @returns {Handler}
 */
Handler.prototype.setResponse = function (response) {
    this.__response = response;
    return this;
};

module.exports = Handler;
