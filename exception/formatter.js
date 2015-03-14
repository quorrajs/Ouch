/**
 * formatter.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
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
    },
    /**
     * Returns all basic information about the exception in a simple array
     * for further conversion to other languages
     * @param  {Inspector} inspector
     * @param  {boolean}   shouldAddTrace
     * @return {Array}
     */
    formatExceptionAsDataArray: function (inspector, shouldAddTrace) {
        var exception = inspector.getException();
        var frames = inspector.getFrames();
        var response = {
            'type': inspector.getExceptionName(),
            'message': inspector.getExceptionMessage(),
            'file': frames[0].getFileName(),
            'line': frames[0].getLineNumber()
        };

        if (shouldAddTrace) {
            var frameData = [];

            frames.forEach(function (frame) {
                /** @var Frame frame */
                var className = frame.getFunctionName();
                var methodName = frame.getMethodName();
                frameData.push({
                    'file': frame.getFileName(),
                    'line': frame.getLineNumber(),
                    'function': methodName ? methodName : '<#anonymous>',
                    'class': className ? (methodName ?
                        className.slice(0, className.length - methodName.length - 1) : className) : ''
                });
            });

            response['trace'] = frameData;
        }

        return response;
    }

};

module.exports = formatter;