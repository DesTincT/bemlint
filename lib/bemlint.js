/**
 * @fileoverview Attribute Parsing
 * @author Ivan Sobolev
 */

"use strict";

var path = require("path"),
    fs = require("fs"),
    minify = require("jsonminify"),
    debug = require("debug"),
    glob = require("glob"),
    shell = require("shelljs"),
    bemNaming = require("bem-naming"),
    attrClassRegex = /^(.*<.*?class="(.*?)".*)$/gim;

fs.existsSync = fs.existsSync || path.existsSync;

var defaultOptions = {
    elem: '__',
    mod: '_',
    wordPattern: '[a-zA-Z0-9]+'
};

function BEMLintParser(options) {

    options = Object.assign(Object.create(null), defaultOptions, options);

    this.options = options;

    bemNaming(options);
};

function runOnText (text, filePath) {
    var match,
        messages = [];

    while (match = attrClassRegex.exec(text)) {
        var className = match[2],
            lineNumber = getLineNumber(text, match[1]),
            columnNumber = match[1].indexOf(match[2]),
            message = getMessage(className);

        if ( message ) {
            messages.push({
                line: lineNumber,
                column: columnNumber,
                message: message
            });
        }


    }

    var result = {
        filePath: filePath,
        messages: messages
    };

    return result;
};


BEMLintParser.prototype = {

    constructor: BEMLintParser,

    executeOnFiles: function (files) {
        var startTime = Date.now(),
            results = [];


        function runOnFile (file) {
            var filePath = path.resolve(file);

            debug("Processing " + filePath);

            var text = fs.readFileSync(filePath, "utf8");
            var result = runOnText(text, filePath);

            results.push(result);
        };


        files.forEach(function(pattern) {

            var file = path.resolve(pattern);

            if (shell.test("-f", file)) {
                runOnFile(fs.realpathSync(pattern), !shell.test("-d", file));
            } else {
                glob.sync(pattern, globOptions).forEach(function(globMatch) {
                    runOnFile(globMatch, false);
                });
            }

        });

        return {
            results: results
        };

        debug("Linting complete in: " + (Date.now() - startTime) + "ms");
    }
};

function getLineNumber(file, lineString) {
    var limit = file.indexOf(lineString),
        substring = file.substr(0, limit);
    return substring.split("\n").length;
}


Array.prototype.isplice = function(array, index) {
    return array.slice(0, index).concat(array.slice(index + 1));
}


function getMessage(string) {
    var arrayClasses = string.split(/\s+/),
    messages = [],
    parser = {
        valid: function() {
            return bemNaming.validate(string) ? 'Valid BEM-naming notation' : 'Not valid BEM';
        },

        checkBlock: function(bemObj, classes, index) {
            var message,
                spliced = classes.slice();

            if ( spliced.length > 1 ) {
                spliced = spliced.isplice(spliced, index);
            }

            for (var i = spliced.length - 1; i >= 0; i--) {
                var className = spliced[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj && currentbemObj.block == bemObj.block ) {
                    if ( bemNaming.isElem(className) ) {
                        message = 'Element of the same block in class';
                        break;
                    }
                }
            }

            return message;

        },

        checkBlockMod: function(bemObj, classes, index) {
            var message,
                spliced = classes.slice();

            if ( spliced.length > 1 ) {
                spliced = spliced.isplice(spliced, index);
                for (var i = spliced.length - 1; i >= 0; i--) {
                    var className = spliced[i],
                    currentbemObj = bemNaming.parse(className);

                    if ( currentbemObj && currentbemObj.block == bemObj.block ) {

                        if ( !bemNaming.isBlock(className) ) {
                            message = 'Using block_mod_val without Block';
                        } else {
                            message = '';
                            break;
                        }
                    } else {
                        message = 'Using block_mod_val without Block';
                    }
                }
            } else {
                message = 'Using block__mod_val without Block';
            }

            return message;

        },

        checkElement: function(bemObj, classes, index) {
            var message,
                spliced = classes.slice();

            if ( spliced.length > 1 ) {
                spliced = spliced.isplice(spliced, index);

                for (var i = spliced.length - 1; i >= 0; i--) {
                    var className = spliced[i],
                    currentbemObj = bemNaming.parse(className);

                    if ( currentbemObj ) {
                        if ( currentbemObj.block == bemObj.block ) {

                            if ( bemObj.elem !== currentbemObj.elem ) {
                                message = 'Multiple Elements of the same Block';
                            }

                            if ( bemObj.elem !== currentbemObj.elem ) {
                                message = 'Using elem__mod_val without Element';
                            }

                            if ( bemNaming.isBlock(currentbemObj) ) {
                                message = 'Element of the same block in class';
                            }

                        } else {
                            message = 'Using elem__mod_val without Element';
                        }
                    }

                }
            } else {
                if ( bemNaming.isElemMod(spliced[0])) {
                    message = 'Using elem__mod_val without Element';
                }

            }

            return message;

        },

        parse: function() {
            var currentBlock = '';

            for (var i = 0; i < arrayClasses.length; i++) {
                var className = arrayClasses[i],
                    bemObj = bemNaming.parse(className);

                if ( bemObj && bemNaming.isBlock(className) ) {
                   messages[i] = parser.checkBlock(bemObj, arrayClasses, i);
                }

                if ( bemObj && bemNaming.isBlockMod(className) ) {
                    messages[i] = parser.checkBlockMod(bemObj, arrayClasses, i);
                }

                if ( bemObj && bemObj.elem ) {
                   messages[i] = parser.checkElement(bemObj, arrayClasses, i);
                }

            }
            return messages.join("");
        },


    };

    return parser.parse();
}

module.exports = BEMLintParser;
