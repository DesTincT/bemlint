/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
 * @author Ivan Sobolev
 */

"use strict";

var lodash    = require("lodash"),
    bemNaming = require("@bem/naming"),
    allRules  = require("./rules");


function ruleValidator($, rule_id, options) {
    this.rule      = allRules[rule_id];
    this.input     = options.input;
    this.source    = options.source;
    this.bemlintId = options.bemlintId;

    this.bemNaming = bemNaming({
        delims: {
            elem:         options.elem,
            mod:          options.mod,
        },
        wordPattern:  options.wordPattern
    });

    this.valid = true;
    if ( allRules[rule_id] && this.isRuleOptionsValid() ) {
        this.valid = allRules[rule_id].valid(this.bemNaming, this.input, this.source, $, this.bemlintId);
    }
};

ruleValidator.prototype = {
    constructor: ruleValidator,

    isRuleOptionsValid: function() {
        var parsed = this.bemNaming.parse(this.input) || { block:'', mod: '', elem: '' };
        if (    this.rule.isBlock && !parsed.mod && !parsed.elem     ||
                this.rule.isElem  && parsed.elem && !parsed.elem.mod ||
                this.rule.isBlockMod && parsed.block && parsed.mod   ||
                this.rule.isElemMod && parsed.elem && parsed.elem.mod )  {

            return true;
        }

        return false;
    }
};


module.exports = ruleValidator;
