/**
 * frame.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var fs = require('fs');
var path = require('path');

/**
 * Adds additional prototypes to CallSite objects returned by stack-trace module.
 *
 * @param frame
 * @returns frame
 */
function frame(frame) {
    frame.__comments = [];
    frame.__proto__ = {
        __proto__: frame.__proto__,

        /**
         * Returns the contents of the file for this frame as an
         * array of lines, and optionally as a clamped range of lines.
         *
         * NOTE: lines are 0-indexed
         *
         * @throws RangeError if length is less than or equal to 0
         * @param  start
         * @param  length
         * @returns {Array|undefined}
         */

        getFileLines: function (start, length) {
            if (!start) {
                start = 0;
            }
            var contents = this.getFileContents();
            if (null !== contents) {
                var lines = (contents).split("\n");

                // Get a subset of lines from $start to $end
                if (length !== null) {
                    start = parseInt(start);
                    length = parseInt(length);
                    if (start < 0) {
                        start = 0;
                    }

                    if (length <= 0) {
                        throw new RangeError(
                            "length cannot be lower or equal to 0"
                        );
                    }

                    lines = lines.slice(start, start + length);
                }

                return lines;
            }
        },

        /**
         * Returns the full contents of the file for this frame, if it's known.
         *
         * @returns {*}
         */
        getFileContents: function () {
            var filePath = this.getFileName();
            if (!this.__fileContentsCache && filePath) {
                // Leave the stage early when 'Unknown' is passed
                // this would otherwise raise an exception when
                // open_basedir is enabled.
                if (filePath === "Unknown") {
                    return null;
                }

                // Return null if the file doesn't actually exist.
                if (!fs.existsSync(filePath)) {
                    if (process.env.NVM_DIR && process.versions.node) {
                        filePath = path.join(process.env.NVM_DIR, 'src/node-v' + process.versions.node, 'lib', filePath);
                        if (!fs.existsSync(filePath)) {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }

                this.__fileContentsCache = fs.readFileSync(filePath, 'utf-8');
            }

            return this.__fileContentsCache;
        },

        /**
         * Adds a comment to this frame, that can be received and used by other handlers. For example, the PrettyPage
         * handler can attach these comments under the code for each frame.
         * An interesting use for this would be, for example, code analysis & annotations.
         *
         * @param {String} comment
         * @param {String} context Optional string identifying the origin of the comment
         */
        addComment: function (comment, context) {
            context = context || 'global';
            this.__comments.push({
                'comment': comment,
                'context': context
            });
        },

        /**
         * Returns all comments for this frame. Optionally allows a filter to only retrieve comments from a specific
         * context.
         *
         * @param  {String} filter
         * @returns {Array}
         */
        getComments: function (filter) {
            if (!filter) {
                filter = null;
            }
            var comments = this.__comments;

            if (filter !== null) {
                comments = comments.filter(function (c) {
                    return c.context === filter;
                });
            }

            return comments;
        }

    };
    return frame;
}

module.exports = frame;

