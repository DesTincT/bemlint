/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
 * @author Ivan Sobolev
 */

"use strict";

var lodash = require("lodash"),
    bemNaming = require("bem-naming"),
    allRules = require("./rules");

/**
 * Constructor for rules validating
 * @method ruleValidator
 * @constructor
 * @param  {[type]}      bemNaming [description]
 * @param  {[type]}      rule_id   [description]
 * @param  {[type]}      options   [description]
 * @return {[type]}                [description]
 */
function ruleValidator(rule_id, options) {
    this.rule = allRules[rule_id];

    this.input = options.input;
    this.source = options.source;
    this.bemNaming = bemNaming({
                    elem:         options.elem,
                    mod:          options.mod,
                    wordPattern:  options.wordPattern
                });

    if ( allRules[rule_id] && this.isRuleOptionsValid() ) {
        this.valid = allRules[rule_id].valid(this.bemNaming, this.input, this.source);
    }

};

ruleValidator.prototype = {
    constructor: ruleValidator,

    isRuleOptionsValid: function() {
        if (    this.rule.isBlock && this.bemNaming.isBlock(this.input)        ||
                this.rule.isElem && this.bemNaming.isElem(this.input)          ||
                this.rule.isBlockMod && this.bemNaming.isBlockMod(this.input)  ||
                this.rule.isElemMod && this.bemNaming.isElemMod(this.input) )  {

            return true;
        }

        return false;
    }
};


module.exports = ruleValidator;
