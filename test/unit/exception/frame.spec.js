/**
 * frame.spec.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

/** do not move this comment from this location - used for testing**/

var Inspector = require("../../../exception/Inspector");
var frame = require("../../../exception/frame");
var fs = require('fs');

describe('frame', function () {
    var inspector = new Inspector(new Error("Sample exception message foo"));

    describe("#getFileLines()", function () {
        it("should return content of specified line numbers of the stack frame file source", function (done) {
            inspector.getFrames()[0].getFileLines(8, 1).should.containEql("/** do not move this comment from this location - used for testing**/");
            done();
        });
    });

    describe("#getFileContents()", function () {
        it("should returns the full contents of the file for the frame", function (done) {
            inspector.getFrames()[0].getFileContents().should.containEql(fs.readFileSync(__filename, 'utf-8'));
            done();
        });
    });

    /**
     * covers #addComment()
     */
    describe('#getComments()', function () {
        it("should get comments set to frame by addComment method", function (done) {
            var frame = inspector.getFrames()[0];

            var testComments = [
                'Dang, yo!',
                'Errthangs broken!',
                'Dayumm!'
            ];

            frame.addComment(testComments[0]);
            frame.addComment(testComments[1]);
            frame.addComment(testComments[2]);

            var comments = frame.getComments();

            comments.should.have.length(3);

            comments[0]['comment'].should.equal(testComments[0]);
            comments[1]['comment'].should.equal(testComments[1]);
            comments[2]['comment'].should.equal(testComments[2]);

            done();
        });
    });


});