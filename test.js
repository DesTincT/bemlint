/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
 * @author Ivan Sobolev
 */

"use strict";

var Message = require('./lib/message'),
    rules = require('./lib/rules'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should();

describe('Check rules', function(){
    var options = { elem: '__', mod: '_' };

    for ( var i in rules ) {
        var rule = rules[i],
            actual = new Message(rule, options);

        actual.should.be.a('object');

        actual.rule.should.be.a('object');

        it(i + ' rule has one of [isBlock, isBlockMod, isElem, isElemMod] conditions', function() {
            actual.rule.should.to.have.any.keys('isBlock', 'isBlockMod', 'isElem', 'isElemMod');
        });

        it(i + ' .valid() exists and is a function', function() {
             actual.rule.valid.should.be.a('function').and.exist;
        });

        it(i + ' .message exists', function() {
            actual.rule.message.should.exist;
        });
    }
});

describe('Message constructor', function() {

    var options = { input: 'b-block', source: ['b-block_mod', 'b-block_mod_value2']},
        rule = rules.dublicate,
        actual = new Message(rule, options);

    it('.getMessage() should return string', function() {
        var text = actual.getMessage();
        expect(text).to.be.a('string');
    });

    it('should contain options.input String', function() {
        actual.options.input.should.be.a('string');
    });

    it('should contain options.source Array', function() {
        actual.options.source.should.be.an('Array');
    });

});


