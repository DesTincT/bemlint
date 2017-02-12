/**
 * @fileoverview Main API for Attribute parsing
 * @author Ivan Sobolev
 */

"use strict";

var path            = require("path"),
    fs              = require("fs"),
    lodash          = require("lodash"),
    EventEmitter    = require("events").EventEmitter,
    Message         = require("./message"),
    rules           = require("./rules"),
    cheerio         = require('cheerio'),
    attrFoundInLine = /^(.*<.+?\s+class=".+)$/gim,
    attrClassRegex  = /\s+class="(.+?)"/gim;


/**
 * Object that is responsible for verifying text
 * @name bemlint
 */
module.exports = (function() {
    var api = Object.create(new EventEmitter()),
        messages = [],
        sourceCode = null;

    /**
     * Verifies the text against the rules specified by the second argument.
     * @param {string} text The text to parse.
     * @param {Object} [options] options for linting
     * @returns {Object[]} The results as an array of messages or null if no messages.
     */

    api.verify = function(text, options) {
        options = options || {};

        // only do this for text
        if ( typeof text === "string" ) {
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

    var matchLine,
        matchClass,
        currentRules   = lodash.assign({}, rules),
        messages       = [],
        modifiedText,
        $;

    if ( options.excludeRules ) {
        for (var i in rules) {
            if ( options.excludeRules.indexOf(i) >= 0 ) {
                delete currentRules[i];
            }
        }
    }

    if ( options.excludeSelectors ) {
        $ = cheerio.load(text);
        $(options.excludeSelectors.join(',')).removeAttr('class');
        text = $.html();
    }

    /**
     * Generates messages for given classname in source
     * @method validate
     * @param  {String} input          classname
     * @param  {Array}  source         Array of classnames from html attribute
     * @param  {Integer} line          line number
     * @param  {Integer} column        column
     * @param  {String} bemlintId       Id for each node matched
     */
    function validate (input, source, line, column, bemlintId) {

        for (var rule_id in currentRules) {
            var messageOptions = lodash.assign({}, {
                    input:  input,
                    source: source,
                    bemlintId: bemlintId,
                    elem:   options.elem,
                    mod:    options.mod,
                    wordPattern: options.wordPattern
                }),
                message = new Message(cheerio.load(modifiedText), rule_id, messageOptions);

            if ( message.text ) {
                messages.push({
                    message: message.text,
                    line: line,
                    column: column,
                    ruleId: rule_id
                });
            }
        }

    };

    /**
     * Checks --bp --bem-prefixes option specified, then checks prefix in string
     * @method checkPrefixes
     * @param  {String}      className  single class
     * @return {Boolean}
     */
    this.checkPrefixes = function(className) {

        if ( options.bemPrefixes ) {
            var valid = false;
            for (var i = options.bemPrefixes.length - 1; i >= 0; i--) {
                if ( className.indexOf(options.bemPrefixes[i]) == 0 ) {
                    valid = true;
                    break;
                }
            }

            return valid;
        }

        return true;

    };

    /**
     * Validates every classname in attr with Rules
     * @method validateString
     * @param  {String}        classString whole `class` attr string
     * @param  {Integer}       line        line number
     * @param  {Integer}       column      column number
     * @param  {Integer}       bemlintId   Id for each node matched
     */
    this.validateString = function(classString, line, column, bemlintId) {
        var arrayClasses = classString.split(/\s+/),
            prevClass = '',
            columnCounted = column,
            excludedString = classString;

        for (var i = 0; i < arrayClasses.length; i++) {
            var className = arrayClasses[i],
                sliced = arrayClasses,
                excludedString = excludedString.replace(className,'');

            if ( this.checkPrefixes(className) ) {

                if ( sliced.length > 1 ) {
                    sliced = arrayClasses.islice(arrayClasses, className);
                }

                validate(className, sliced, line, columnCounted, bemlintId);

            }

            //we want to find column of the next class parsed in a string
            columnCounted += className.length + excludedString.search(/\S/);
            excludedString = excludedString.trim();
        }
    };

    var index = 1;
    var bemlintIds = [];
    modifiedText = text.replace(attrFoundInLine, function(lineString) {
        return lineString.replace(attrClassRegex, function(classString, i, offset, string) {
            var id = new Date().getTime() + index++;

            bemlintIds.push('bemlint-id-' + id);
            return classString + ' id="bemlint-id-' + id + '"';
        });
    });

    index = 0;
    while (matchLine = attrFoundInLine.exec(text)) {
        var oneLine = matchLine[1],
            lineNumber = getLineNumber(text, oneLine);


        while (matchClass = attrClassRegex.exec(oneLine)) {
            var column = oneLine.indexOf(matchClass[1]);

            this.validateString(matchClass[1], lineNumber, column + 1, bemlintIds[index]);
            index++;
        }
    }

    return lodash.uniqWith(messages, lodash.isEqual);
};


function getLineNumber(file, lineString) {
    var limit = file.indexOf(lineString),
        substring = file.substr(0, limit);
    return substring.split("\n").length;
}

