/**
 * templateHelper.spec.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var TemplateHelper = require('../../../util/TemplateHelper');
var path = require('path');

describe('TemplateHelper', function(){
    var helper = new TemplateHelper();

    /**
     * @covers #getVAriables()
     */
    describe("#setVariables()", function(){
        it("should set template variables which should be available with getVariables method", function(done){
            var variables = {
                name: "Ouch",
                type: "node module"
            };

            helper.setVariables(variables);

            helper.getVariables().should.be.equal(variables);

            done();
        });
    });


    describe("#render()", function(){
        it("should render and ejs template file.", function(done){
            var template = path.join(__dirname, "../../fixtures/template.ejs");

            helper.render(template, {"name": "B<o>b"}).should.be.equal("hello-world\nMy name is B&lt;o&gt;b");

            done();
        });
    });

    describe("#slug()", function(){
        it("should convert a string to slug version", function(done){
            "hello-world".should.be.equal(helper.slug("Hello, world!"));
            "potato-class".should.be.equal(helper.slug("Potato class"));
            done();
        })
    });

    describe("#escapeButPreserveUris()", function(){
       it("should html escape string but preseve url's and convert it to clickable anchor elements", function(done){
           var original = "This is a <a href=''>http://google.com</a> test string";

           helper.escapeButPreserveUris(original)
               .should.be
               .equal("This is a &lt;a href=&#39;&#39;&gt;<a href=\"http://google.com\" target=\"_blank\">http://google.com</a>&lt;/a&gt; test string");

           done();
       });
    });

});