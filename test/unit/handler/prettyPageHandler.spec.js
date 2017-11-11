/**
 * prettyPageHandler.spec.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Ouch = require("../../../Ouch");
var PrettyPageHandler = require("../../../handler/PrettyPageHandler");
var cheerio = require("cheerio");

describe("PrettyPageHandler", function(){
    /**
     * Test that PrettyPageHandler handles the template without
     * any errors.
     * @covers PrettyPageHandler#handle
     */
   describe("#handle()", function(){
        it("should handle exception without errors", function(done){
            var ouch = new Ouch([new PrettyPageHandler()]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response){
                // Reached the end without errors
                done();
            });
        });

        it("should output additional javascript script tags in the template", function(done){
            var scripts = [
                "http://localhost/script1.js",
                "http://localhost/script2.js"
            ];
            var ouch = new Ouch([new PrettyPageHandler("orange", "test", "sublime", false, scripts)]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response) {
                var $ = cheerio.load(response[0]);
                $("script[src='http://localhost/script1.js']").toArray().length.should.equal(1);
                $("script[src='http://localhost/script2.js']").toArray().length.should.equal(1);
                done();
            });
        });
   });

    /**
     * covers #getEditorHref()
     */
    describe("#setEditor()", function(){
        var handler = new PrettyPageHandler();
        it("should set handlers editor to the newly supplied", function(done){

            handler.setEditor("sublime");
            handler.getEditorHref("/foo/bar.js", 10).should.equal("subl://open?url=file://%2Ffoo%2Fbar.js&line=10");
            handler.getEditorHref("/foo/with space?.js", 2324).should.equal("subl://open?url=file://%2Ffoo%2Fwith%20space%3F.js&line=2324");
            handler.getEditorHref("/foo/bar/with-dash.js", 0).should.equal("subl://open?url=file://%2Ffoo%2Fbar%2Fwith-dash.js&line=0");

            handler.setEditor(function (file, line) {
                file = encodeURIComponent(file);
                line = encodeURIComponent(line);
                return "http://google.com/search/?q="+ file + ":" + line;
            });

            handler.getEditorHref("/foo/bar.js", 10).should.equal("http://google.com/search/?q=%2Ffoo%2Fbar.js:10");

            done();
        })
    });

    describe("#addEditor()", function(){
        var handler = new PrettyPageHandler();
        it("should add new editor to the handler", function(done){
            handler.addEditor("test", function (file, line) {
               return "cool beans " + file + ":" + line;
            });

            handler.setEditor("test");
            handler.getEditorHref("hello", 20).should.equal("cool beans hello:20");

            done();
        });
    });

    //@todo: Add remaining cases


});
