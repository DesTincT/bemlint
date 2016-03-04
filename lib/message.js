/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
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

    this.options = lodash.assign({ elem: '__', mod: '_' }, options);

    bemNaming(this.options);

    this.getMessage();
};

Message.prototype = {
    constructor: Message,

    /**
     * [getMessage description]
     * @method getMessage
     * @return {String}           message itself
     */
    getMessage: function () {
        let rule = this.rule,
            input = this.options.input;

        this.isRuleValid = function () {
            if ( rule.isBlock && bemNaming.isBlock(input) || rule.isElem && bemNaming.isElem(input) || rule.isBlockMod && bemNaming.isBlockMod(input) || rule.isElemMod && bemNaming.isElemMod(input) )  {

                return true;
            }

            return false;
        };

        if ( this.isRuleValid(rule) && !rule.valid(input, this.options.source) )  {
            if ( typeof rule.message == 'function' ) {
                return rule.message(this.options);
            } else {
                return rule.message;
            }

        }

    },

};

module.exports = Message;
