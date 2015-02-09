/**
 * formatter.js
 *
 * @author: Harish Anchu <twitter:@harishanchu>
 * Copyright (c) 2015, Harish Anchu. All rights reserved.
 */

var escapeHtml = require('escape-html');

/**
 * formatter utility
 */
var formatter = {
    /**
     * Formats exception to plain string.
     *
     * @param inspector
     * @returns {string} exception formatted to plain string.
     */
    formatExceptionPlain: function (inspector) {
        var err = inspector.getException();
        var plain = err.stack || err.toString();
        plain = escapeHtml(plain)
            .replace(/\n/g, '<br>')
            .replace(/  /g, ' &nbsp;') + '\n';

        return plain;
    }
};

module.exports = formatter;