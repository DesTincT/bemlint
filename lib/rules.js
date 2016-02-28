/**
 * @fileoverview Attribute Parsing
 * @author Ivan Sobolev
 */

"use strict";

var lodash = require("lodash"),
    bemNaming = require("bem-naming");


/**
 * Object that is responsible for verifying JavaScript text
 * @name bemlint
 */
module.exports = (function(options) {

    var bemOptions = lodash.assign({ elem: '__', mod: '_' }, options);

    bemNaming(bemOptions);

    const   blockModVal = 'block' + bemOptions.mod + 'mod' + bemOptions.mod + 'value',
            elemModVal = 'element' + bemOptions.elem + 'mod' + bemOptions.mod + 'value';


    var rules = {

        same: function(input, source) {
            if ( source.indexOf(input) >= 0 ) {
                return 'Dublicate classes';
            }
        },

        /**
         * Checks if element with is's block together
         * @method isBlockElementInBlock
         * @param  {String}             input  className
         * @param  {Array}              source splited array of classes
         * @return {String}             message if not valid
         */
        isBlockElementInBlock: function(input, source) {
            var bemObj = bemNaming.parse(input),
                message;

            if ( bemObj && bemNaming.isBlock(input) || bemNaming.isElem(input) ) {
                for (var i = source.length - 1; i >= 0; i--) {
                    var className = source[i],
                    currentbemObj = bemNaming.parse(className);

                    if ( currentbemObj && currentbemObj.block == bemObj.block &&
                        (
                            bemNaming.isBlock(input) && bemNaming.isElem(className) ||
                            bemNaming.isElem(input)  && bemNaming.isBlock(className)
                        )) {

                        message = 'Element cannot be in place with it`s Block';
                        break;
                    }

                }
            }

            return message;
        },

        isBlockModNoBlock: function(input, source) {
            var bemObj = bemNaming.parse(input),
                message;

            if ( bemObj && bemNaming.isBlockMod(input) ) {
                for (var i = source.length - 1; i >= 0; i--) {
                    var className = source[i],
                    currentbemObj = bemNaming.parse(className);

                    if ( currentbemObj ) {
                        if ( currentbemObj.block == bemObj.block && bemNaming.isBlock(className) ) {
                            message = '';
                            break;
                        } else {
                            message = 'A ' + blockModVal + ' ('+ input + ') specified, but Block('+ bemObj.block +') not found';
                        }
                    }

                }
            }
            return message;
        },

        isElemModNoElement: function(input, source) {
            var bemObj = bemNaming.parse(input),
                message;

            if ( bemObj && bemNaming.isElemMod(input) ) {
                for (var i = source.length - 1; i >= 0; i--) {
                    var className = source[i],
                    currentbemObj = bemNaming.parse(className);

                    if ( currentbemObj ) {
                        if ( currentbemObj.block == bemObj.block && bemNaming.isElem(className) ) {
                            message = '';
                            break;
                        } else {
                            message = 'A ' + elemModVal + ' specified, but Element not found';
                        }
                    }

                }
            }

            return message;
        }
    };

    return rules;

}());
