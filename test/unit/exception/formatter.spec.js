/**
 * formatter.spec.js
 *
 * @author: Harish Anchu <twitter:@harishanchu>
 * Copyright (c) 2015, Harish Anchu. All rights reserved.
 */

var Inspector = require('../../../exception/Inspector');
var formatter = require('../../../exception/formatter');

describe("Formatter utility", function(){
   describe("#formatExceptionPlain()", function(){
       var msg = "Sample exception message foo";
       it("should format js err stack to plain text", function(){
           var output = formatter.formatExceptionPlain(new Inspector(new Error(msg)));
           output.should.containEql(msg);
           output.should.containEql("<br>");
           output.should.containEql("&nbsp");
       })
   })
});
