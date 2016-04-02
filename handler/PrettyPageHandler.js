/**
 * PrettyPageHandler.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2015, Harish Anchu. All rights reserved.
 * @license Licensed under MIT (https://github.com/quorrajs/Ouch/blob/master/LICENSE)
 */

var path = require('path');
var fs = require('fs');
var formatter = require('../exception/formatter');
var _ = require('lodash');
var isEmpty = _.isEmpty;
var TemplateHelper = require('../util/TemplateHelper');
var url = require('url');
var os = require('os');
var inspect = require('util').inspect;
var Handler = require('./Handler');
var util = require('util');

/**
 * Prettifies a javascript error stack.
 *
 * @param theme
 * @param pageTitle
 * @param editor
 * @param sendResponse
 * @class
 */
function PrettyPageHandler(theme, pageTitle, editor, sendResponse) {

    PrettyPageHandler.super_.call(this);

    /**
     * @var {String}
     * @protected
     */
    this.__pageTitle = pageTitle || "Ouch! There was an error.";

    /**
     * @var {String}
     * @protected
     */
    this.__theme = theme || "blue";

    /**
     * A string identifier for a known IDE/text editor, or a closure
     * that resolves a string that can be used to open a given file
     * in an editor. If the string contains the special substrings
     * %file or %line, they will be replaced with the correct data.
     *
     * @example
     *  "txmt://open?url=%file&line=%line"
     *
     * @var {*} editor
     * @protected
     */
    this.__editor = editor;

    /**
     * Should Ouch push output directly to the client?
     * If this is false, output will be passed to the callback
     * provided to the handle method.
     * @type {boolean}
     * @protected
     */
    this.__sendResponse = sendResponse === undefined ? true : Boolean(sendResponse);

    /**
     * A list of known editor strings
     *
     * @var Object
     * @protected
     */
    this.__editors = {
        "sublime": "subl://open?url=file://%file&line=%line",
        "textmate": "txmt://open?url=file://%file&line=%line",
        "emacs": "emacs://open?url=file://%file&line=%line",
        "macvim": "mvim://open/?url=file://%file&line=%line"
    };
}

util.inherits(PrettyPageHandler, Handler);

/**
 * Handles the error
 *
 * @param {function} next
 */
PrettyPageHandler.prototype.handle = function (next) {

    var helper = new TemplateHelper();

    var templateFile = this.__getResource("views/layout.ejs");
    var cssFile = this.__getResource("css/ouch." + this.__theme + ".css");
    var zeptoFile = this.__getResource("js/zepto.min.js");
    var clipBoardFile = this.__getResource("js/clipboard.js");
    var jsFile = this.__getResource("js/ouch.base.js");


    var inspector = this.__inspector;
    var frames = inspector.getFrames();

    var code = inspector.getCode();

    // List of variables that will be passed to the layout template.
    var data = {
        "pageTitle": this.__pageTitle,
        "stylesheet": fs.readFileSync(cssFile),
        "zepto": fs.readFileSync(zeptoFile),
        "javascript": fs.readFileSync(jsFile),
        "clipboard": fs.readFileSync(clipBoardFile),

        // Template paths:
        "header": this.__getResource("views/header.ejs"),
        "frameList": this.__getResource("views/frameList.ejs"),
        "frameCode": this.__getResource("views/frameCode.ejs"),
        "envDetails": this.__getResource("views/envDetails.ejs"),
        "filename": templateFile,

        "title": this.__pageTitle,
        "name": inspector.getExceptionName(),
        "message": inspector.getExceptionMessage(),
        "code": code,
        "plainException": formatter.formatExceptionPlain(inspector),
        "frames": frames,
        "hasFrames": frames.length,
        "handler": this,
        "handlers": this.__run ? this.__run.getHandlers() : [],

        "isEmpty": isEmpty,
        "inspect": inspect,

        "tables": {
            "Server/Request Data": this.__getServerAndRequestInfo(),
            "params": this.__getRequestParams(),
            "Cookies": this.__parseCookies(),
            //"Session": [],
            "Environment Variables": process.env
        }
    };

    helper.setVariables(data);

    var handlerResponse = helper.render(templateFile);

    if (this.__response && this.__sendResponse) {
        if (!this.__response.headersSent) {
            this.__response.setHeader("Content-Type", "text/html");
            this.__response.writeHead(code);
        }

        this.__response.end(handlerResponse);
        next(null, Handler.QUIT);
    } else {
        next(handlerResponse);
    }

};

/**
 * Given a string file path, and an integer file line,
 * executes the editor resolver and returns, if available,
 * a string that may be used as the href property for that
 * file reference.
 *
 * @throws ReferenceError If editor resolver does not return a string
 * @param  filePath
 * @param  line
 * @returns {false|string}
 */
PrettyPageHandler.prototype.getEditorHref = function (filePath, line) {
    if (!this.__editor/* || path.basename(filePath) === filePath*/) {
        return false;
    }

    var editor = this.__editor;
    if (_.isString(editor)) {
        editor = this.__editors[editor];
    }

    if (_.isFunction(editor)) {
        editor = editor.call(null, filePath, line);
    }

    // Check that the editor is a string, and replace the
    // %line and %file placeholders:
    if (!_.isString(editor)) {
        throw new ReferenceError(
            this.callee + " should always resolve to a string; got something else instead"
        );
    }

    editor = editor.replace("%line", encodeURIComponent(line));
    editor = editor.replace("%file", encodeURIComponent(filePath));

    return editor;
};

/**
 * Adds an editor resolver, identified by a string
 * name, and that may be a string path, or a callable
 * resolver. If the callable returns a string, it will
 * be set as the file reference's href attribute.
 *
 * @example
 *  ouch.addEditor('macvim', "mvim://open?url=file://%file&line=%line")
 * @example
 *   ouch.addEditor('remove-it', function(file, line) {
 *       ......
 *       return "http://stackoverflow.com";
 *   });
 * @param {string} identifier
 * @param {string|function} resolver
 */
PrettyPageHandler.prototype.addEditor = function (identifier, resolver) {
    this.__editors[identifier] = resolver;
};

/**
 * Set the editor to use to open referenced files, by a string
 * identifier, or a callable that will be executed for every
 * file reference, with a file and line argument, and should
 * return a string.
 *
 * @example
 *   ouch.setEditor(function(file, line) { return "file:///"+ file; });
 * @example
 *   ouch.setEditor('sublime');
 *
 * @throws ReferenceError If invalid argument identifier provided
 * @param  {string|function} editor
 */
PrettyPageHandler.prototype.setEditor = function (editor) {
    if (!_.isFunction(editor) && !(this.__editors[editor])) {
        throw new ReferenceError(
            "Unknown editor identifier: editor. Known editors:".
                Object.keys(this.__editors).join(", ")
        );
    }
    this.__editor = editor;
};

/**
 * @throws Error If resource cannot be found.
 *
 * @param  {string} resource
 * @returns string
 * @protected
 */
PrettyPageHandler.prototype.__getResource = function (resource) {
    var fullPath = path.join(__dirname, '../resources/', resource);

    if (fs.existsSync(fullPath)) {
        return fullPath;
    }

    // If we got this far, nothing was found.
    throw new Error("Could not find resource " + resource + " in resource path.");
};

/**
 * Parses cookies from request headers.
 *
 * @returns {Object}
 */
PrettyPageHandler.prototype.__parseCookies = function () {
    var list = {};
    if (this.__request !== null) {
        var rc = this.__request.headers.cookie;

        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }

    return list;
};

/**
 * Returns query string data and request body if it exists from request object.
 *
 * @returns {Object}
 */
PrettyPageHandler.prototype.__getRequestParams = function () {
    var params = {};

    if (this.__request !== null) {
        var url_parts = url.parse(this.__request.url, true);
        params.queryStringData = url_parts.query;

        if (this.__request.body) {
            params.requestBody = this.__request.body;
        }
    }

    return params;
};

/**
 * Returns Object containing general information about running node server and request.
 *
 * @returns {Object}
 */
PrettyPageHandler.prototype.__getServerAndRequestInfo = function () {
    var info = {};
    if (this.__request !== null) {
        var req = this.__request;
        info = {
            REMOTE_ADDR: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress,
            REMOTE_PORT: req.connection.remotePort,
            SERVER_SOFTWARE: 'NodeJS ' + process.versions.node + " " + os.type(),
            SERVER_PROTOCOL: this.__getRequestProtocol() + "/" + req.httpVersion,
            //@todo: replace with host servername
            //SERVER_NAME: os.hostname(),
            //SERVER_PORT: this.__request.socket.localPort,
            REQUEST_URI: this.__request.url,
            REQUEST_METHOD: this.__request.method,
            SCRIPT_FILE: require.main.filename,
            PATH_INFO: url.parse(this.__request.url).pathname,
            QUERY_STRING: url.parse(this.__request.url).query,
            HTTP_HOST: req.headers.host,
            HTTP_CONNECTION: req.headers.connection,
            HTTP_CACHE_CONTROL: req.headers['cache-control'],
            HTTP_ACCEPT: req.headers.accept,
            HTTP_USER_AGENT: req.headers['user-agent'],
            HTTP_DNT: req.headers.dnt,
            HTTP_ACCEPT_ENCODING: req.headers['accept-encoding'],
            HTTP_ACCEPT_LANGUAGE: req.headers['accept-language'],
            HTTP_COOKIE: req.headers.cookie
        }
    }

    return info;
};

/**
 * Returns request connection protocol.
 *
 * @returns {String}
 */
PrettyPageHandler.prototype.__getRequestProtocol = function () {
    var proto = this.__request.connection.encrypted
        ? 'https'
        : 'http';

    // Note: X-Forwarded-Proto is normally only ever a
    //       single value, but this is to be safe.
    proto = this.__request.headers['X-Forwarded-Proto'] || proto;
    return proto.split(/\s*,\s*/)[0].toUpperCase();
};


module.exports = PrettyPageHandler;
