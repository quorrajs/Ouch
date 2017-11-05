/**
 * TemplateHelper
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */
var util = require('util');
var ejs = require('ejs');
var fs = require('fs');

/**
 * Template helper
 *
 * @class
 */
function TemplateHelper() {
    /**
     * A map of variables to be passed to all templates
     *
     * @var {Object}
     * @protected
     */
    this.__variables = {};
}

/**
 * Sets the variables to be passed to all templates rendered
 * by this template helper.
 *
 * @param {Object} variables
 */
TemplateHelper.prototype.setVariables = function (variables) {
    this.__variables = variables || {};
};

/**
 * Returns all variables for this helper
 *
 * @returns {Object}
 */
TemplateHelper.prototype.getVariables = function () {
    return this.__variables;
};

/**
 * Given a template path, render it within its own scope. This
 * method also accepts an array of additional variables to be
 * passed to the template.
 *
 * @param {String} template
 * @param {Object} additionalVariables
 * @returns {String}
 */
TemplateHelper.prototype.render = function (template, additionalVariables) {
    var variables = this.getVariables();

    // Pass the helper to the template:
    variables["tpl"] = this;

    if (additionalVariables) {
        variables = util._extend(variables, additionalVariables);
    }

    return ejs.render(fs.readFileSync(template, 'utf-8'), variables);
};

/**
 * Convert a string to a slug version of itself
 *
 * @param   {String} original
 * @returns {String}
 */
TemplateHelper.prototype.slug = function (original) {
    var slug = original.replace(/ /g, "-");
    slug = slug.replace(/[^\w\d\-\_]/gi, '');
    return slug.toLocaleLowerCase();
};


/**
 * Escapes a string for output in an HTML document, but preserves
 * URIs within it, and converts them to clickable anchor elements.
 *
 * @param   {string} raw
 * @returns {string}
 */
TemplateHelper.prototype.escapeButPreserveUris = function (raw) {
    var escaped = ejs.render("<%= \"" + raw + "\" %>");
    return escaped.replace(/([A-z]+?:\/\/([-\w\.]+[-\w])+(:\d+)?(\/([\w\/_\.#-]*(\?\S+)?[^\.\s])?)?)/g,
        "<a href=\"$1\" target=\"_blank\">$1</a>");
};

module.exports = TemplateHelper;
