/**
 * @fileoverview Message generator
 * @author Ivan Sobolev
 */

"use strict";

var lodash = require("lodash"),
    bemNaming = require("bem-naming");

/**
 * Constructor
 * @method Message
 * @param  {Object} rule object
 * @param  {Object} options options for bem-naming
 * @constructor
 */
function Message(rule, options) {

    this.rule = rule;

    this.options = options;

    this.bemNaming = bemNaming(this.options);

    /**
     * Generated text of message
     * @type {string}
     */
    this.text = this.getMessage();
};

Message.prototype = {
    constructor: Message,

    /**
     * Validates input string with rule and returns message text
     * @method getMessage
     * @return {String}           message itself
     */
    getMessage: function () {
        let rule = this.rule,
            input = this.options.input;

        this.isRuleOptionsValid = function () {

            if (    rule.isBlock && this.bemNaming.isBlock(input)        ||
                    rule.isElem && this.bemNaming.isElem(input)          ||
                    rule.isBlockMod && this.bemNaming.isBlockMod(input)  ||
                    rule.isElemMod && this.bemNaming.isElemMod(input) )  {

                return true;
            }

            return false;
        };

        if ( this.isRuleOptionsValid(rule) && !rule.valid(this.bemNaming, input, this.options.source) )  {
            if ( typeof rule.message == 'function' ) {
                return rule.message(this.options);
            } else {
                return rule.message;
            }

        }

        return '';

    },

};

module.exports = Message;
