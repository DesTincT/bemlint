/**
 * @fileoverview Message generator
 * @author Ivan Sobolev
 */

"use strict";

var lodash = require("lodash"),
    ruleValidator = require("./rule-validator");

/**
 * Constructor
 * @method Message
 * @param  {Object} rule object
 * @param  {Object} options options for bem-naming
 * @constructor
 */
function Message($, rule_id, options) {

    var rule = new ruleValidator($, rule_id, options),
        message = '';

    if ( typeof rule.valid === 'boolean' && !rule.valid ) {
        message = typeof rule.rule.message == 'function' ? rule.rule.message(options) : rule.rule.message;
    }

    this.text = message;
};


module.exports = Message;
