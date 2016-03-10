/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
 * @author Ivan Sobolev
 */

"use strict";

var fs = require("fs"),
    Message = require('./lib/message'),
    rules = require('./lib/rules'),
    bemlint = require('./lib/bemlint'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('Check rules', function(){
    var options = { elem: '__', mod: '_' };

    for ( var i in rules ) {
        var rule = rules[i];

        rule.should.be.a('object');

        it(i + ' rule has one of [isBlock, isBlockMod, isElem, isElemMod] conditions', function() {
            rule.should.to.have.any.keys('isBlock', 'isBlockMod', 'isElem', 'isElemMod');
        });

        it(i + '.valid() exists and is a function', function() {
            rule.valid.should.be.a('function').and.exist;
        });

        it(i + '.message exists', function() {
            rule.message.should.exist;
        });
    }
});

describe('bemlint.verify(text) should return an array', function() {

    var actual = bemlint.verify(fs.readFileSync('./example.html', "utf8"));


    expect(actual).to.be.a('array');

    for ( var i = 0, l = actual.length; i < l; i++ ) {
        var message = actual[i];

        it('message ' + message + ' should be an object', function() {
            message.should.be.a('object');
        });

        it('{}.message should be a string', function() {
            message.message.should.be.a('string');
        });

        it('{}.line = ' + (message.line) + ' should be a number', function() {
            message.line.should.be.a('number');
        });

        it('{}.column = ' + (message.column) + ' should be a number', function() {
            message.column.should.be.a('number');
        });

        it('{}.ruleId = ' + (message.ruleId) + ' should be a string', function() {
            message.ruleId.should.be.a('string');
        });

    }

});


