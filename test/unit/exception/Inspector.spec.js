/**
 * Inspector.spec.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var Inspector = require("../../../exception/Inspector");

describe("Inspector", function(){
    describe("#getFrames()", function(){
        var inspector = new Inspector(new Error("Sample exception message foo"));
        var methods = [
            'getFileName',
            'getLineNumber',
            'getFunctionName',
            'getTypeName',
            'getMethodName',
            'getColumnNumber',
            'isNative'
        ];
        it("should return array of CallSite objects of exception with methods "+methods.join(", "), function(done){
            methods.forEach(function(method){
                inspector.getFrames()[0][method].should.be.a.function;
            });
            done();
        });

    });

    describe("#getCode()", function(){
        it("should return 500 when status is not set on exception", function(done){
            var inspector = new Inspector(new Error("Sample exception message foo"));
            inspector.getCode().should.equal(500);
            done();
        });

        it("should return 500 when status is set but less than 400 on exception", function(done){
            var err = new Error("Sample exception message foo");
            err.status = 200;
            var inspector = new Inspector(err);
            inspector.getCode().should.equal(500);
            done();
        });

        it("should return value set to status property of exception if it is greater than 399", function(done){
            var err = new Error("Sample exception message foo");
            err.status = 450;
            var inspector = new Inspector(err);
            inspector.getCode().should.equal(450);
            done();
        });
    });

    describe("#getException()", function(){
       it("should return the exception set via constructor", function(done){
           var err = new Error("Sample exception message foo");
           var inspector = new Inspector(err);
           inspector.getException().should.equal(err);
           done();
       })
    });

    describe("#getExceptionName()", function(){
        it("should return the name property of exception if it's truthy or string: 'Error thrown'", function(done){
            var err = new Error("Sample exception message foo");
            var inspector = new Inspector(err);
            inspector.getExceptionName().should.equal("Error");

            err.name = "My Custom Error Name";
            inspector.getExceptionName().should.equal("My Custom Error Name");

            err.name = null;
            inspector.getExceptionName().should.equal("Error thrown");
            done();
        })
    });

    describe("#getExceptionMessage()", function(){
        it("should return the message property of exception if present else empty string", function(done){
            var err = new Error("Sample exception message foo");
            var inspector = new Inspector(err);
            inspector.getExceptionMessage().should.equal("Sample exception message foo");

            err = new Error();
            inspector = new Inspector(err);
            inspector.getExceptionMessage().should.equal("");
            done();
        })
    });
});