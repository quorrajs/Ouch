/**
 * JsonResponseHandler.spec.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Ouch = require('../../../Ouch');
var JsonResponseHandler = require('../../../handler/JsonResponseHandler');

describe("JsonResponseHandler", function(){
    /**
     * Test that JsonResponseHandler handles the template without
     * any errors.
     */
    describe("#handle()", function(){
        it("should handle exception without errors", function(done){
            var ouch = new Ouch([new JsonResponseHandler()]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response){
                // Reached the end without errors
                done();
            })
        });

        it("should return json response to the callback when http request object is not set", function(done){
            var ouch = new Ouch([new JsonResponseHandler()]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response){
                response[0].should.be.json;
                done();
            })
        });


        it("should return json response without frames", function(done){
            var ouch = new Ouch([new JsonResponseHandler()]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response){
                response = JSON.parse(response[0]);

                // Check that the response has the expected keys
                response.should.have.keys('error');
                response['error'].should.have.keys('type', 'file', 'line', 'message');

                // Check the field values:
                response.error.type.should.be.equal('Error');
                response.error.file.should.be.equal(__filename);
                response.error.line.should.be.equal(37);
                done();
            })
        });

        it("should return json response with frames", function(done){
            var ouch = new Ouch([new JsonResponseHandler(false, true)]);
            ouch.handleException(new Error("Test error foo"), null, null, function(response){
                response = JSON.parse(response[0])['error'];

                // Check that the response has the expected keys
                response.should.have.properties('trace');
                response['trace'][0].should.have.keys('file', 'line', 'function', 'class');
                done();
            })
        });
    });
});
