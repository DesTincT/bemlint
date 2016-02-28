/**
 * @fileoverview Attribute Parsing
 * @author Ivan Sobolev
 */

"use strict";

var path = require("path"),
    fs = require("fs"),
    lodash = require("lodash"),
    EventEmitter = require("events").EventEmitter,
    rules = require("./rules"),
    attrClassRegex = /^(.*<.*?class="(.*?)".*)$/gim;


Array.prototype.islice = function(array, string) {
    var index = array.indexOf(string);
    return array.slice(0, index).concat(array.slice(index + 1));
}
/**
 * Object that is responsible for verifying JavaScript text
 * @name bemlint
 */
module.exports = (function() {
    var api = Object.create(new EventEmitter()),
        messages = [],
        currentFilename = null,
        sourceCode = null;

    /**
     * Resets the internal state of the object.
     * @returns {void}
     */
    api.reset = function() {
        this.removeAllListeners();
        messages = [];
        sourceCode = null;
    };

    /**
     * Verifies the text against the rules specified by the second argument.
     * @param {string|SourceCode} textOrSourceCode The text to parse or a SourceCode object.
     * @param {(string|Object)} [filenameOrOptions] The optional filename of the file being checked.
     *      If this is not set, the filename will default to '<input>' in the rule context. If
     *      an object, then it has "filename", "saveState"
     * @param {boolean} [saveState] Indicates if the state from the last run should be saved.
     *      Mostly useful for testing purposes.
     * @returns {Object[]} The results as an array of messages or null if no messages.
     */

    api.verify = function(textOrSourceCode, options) {
        var text = (typeof textOrSourceCode === "string") ? textOrSourceCode : null;

        currentFilename = options.filename;

        if (!options.saveState) {
            this.reset();
        }

        // only do this for text
        if (text !== null) {
            // there's no input, just exit here
            if (text.trim().length === 0) {
                return messages;
            }
        }

        var messages = new Parser(text, options);

        return messages;
    };

    return api;
}());

Array.prototype.islice = function(array, string) {
    var index = array.indexOf(string);
    return array.slice(0, index).concat(array.slice(index + 1));
}

function Parser(text, options) {

    var match,
        messages = [];

    /**
     * Validates input in source with given rules
     * @method validate
     * @param  {String} input
     * @param  {Array}  source         Array of classnames from html attribute
     * @param  {Integer} line          line number
     * @param  {Integer} column        column
     * @param  {Array} rulesToExclude  List of rules to be excluded for validate
     */
    function validate (input, source, line, column, rulesToExclude) {
        var currentRules = lodash.assign({}, rules);

        if ( rulesToExclude ) {
            for (var i in rules) {
                if ( rulesToExclude.indexOf(i) >= 0 ) {
                    delete currentRules[i];
                }
            }
        }

        for (var i in currentRules) {
            var message = rules[i](input, source);

            if ( message ) {
                messages.push({
                    message: message,
                    line: line,
                    column: column,
                    rule: i
                });
            }
        }
    };

    /**
     * Checks --bp --bem-prefixes option specified
     * @method checkPrefixes
     * @param  {String}      string parsed from attr class name
     * @return {Boolean}
     */
    this.checkPrefixes = function(string) {

        if ( options.bemPrefixes ) {
            var valid = false;
            for (var i = options.bemPrefixes.length - 1; i >= 0; i--) {
                if ( new RegExp('^' + options.bemPrefixes[i]).test(string) ) {
                    valid = true;
                    break;
                }
            }

            return valid;
        } else {
            return true;
        }

    };

    /**
     * Validates every classname in attr with Rules
     * @method validateString
     * @param  {String}       classString whole `class` attr string
     * @param  {[type]}       line        line number
     * @param  {[type]}       column      column number
     */
    this.validateString = function(classString, line, column) {
        var arrayClasses = classString.split(/\s+/),
            prevClass = '',
            columnCounted = column,
            excludedString = classString;

        for (var i = 0; i < arrayClasses.length; i++) {
            var className = arrayClasses[i],
                sliced = arrayClasses,
                excludedString = excludedString.replace(className,'');


            if ( this.checkPrefixes(className) ) {

                if ( arrayClasses.length > 1 ) {

                    sliced = arrayClasses.islice(arrayClasses, className);

                    validate(className, sliced, line, columnCounted);
                } else {
                    validate(className, sliced, line, columnCounted, ['same']);
                }

            }


            columnCounted += className.length + excludedString.search(/\S/);
            excludedString = excludedString.trim();
        }
    };


    while (match = attrClassRegex.exec(text)) {
        var line = getLineNumber(text, match[1]),
            classString = match[2],
            column= match[1].indexOf(classString);

        this.validateString(classString, line, column + 1);
    }


    return lodash.uniqWith(messages, lodash.isEqual);
};


function getLineNumber(file, lineString) {
    var limit = file.indexOf(lineString),
        substring = file.substr(0, limit);
    return substring.split("\n").length;
}

