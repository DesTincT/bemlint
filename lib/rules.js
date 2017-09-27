/**
 * @fileoverview Validation rules with bem-naming tech from Yandex
 * @author Ivan Sobolev
 */

"use strict";


var allRules = {
    /**
     * dublicate classes found
     * @type {Object}
     */
    dublicate: {
        isBlock: true,
        isElem: true,
        isBlockMod: true,
        isElemMod: true,
        /**
         * Can be function or string
         * @method
         * @param  {Object} options
         * @return {String}
         */
        message: 'Dublicate classes found',
        valid: (bemNaming, input, source) => {

            // compare input with itself in source
            if ( source && source[0] == input ) {
                return true;
            }

            return source.indexOf(input) < 0;
        }
    },

    /**
     * Block and his element cannot be in one place, wrong => class="b-block b-block__element"
     * @type {Object}
     */
    isBlockElementInBlock: {
        isBlock: true,
        isElem: true,
        message: (options) => 'block' + options.elem + 'element cannot be in place with it`s block',

        valid: function(bemNaming, input, source) {
            var valid = true,
                bemObj = bemNaming.parse(input) || {};

            for (var i = source.length - 1; i >= 0; i--) {
                var className = source[i],
                currentbemObj = bemNaming.parse(className) || {};

                if ( currentbemObj && currentbemObj.block == bemObj.block &&
                    (
                        !bemObj.elem && currentbemObj.elem ||
                        bemObj.elem  && !currentbemObj.elem
                    )) {
                    valid = false;
                    break;
                }
            }

            return valid;
        }
    },

    /**
     * Block mod should be only with it's block, wrong => class="b-block_mod_val"
     * @type {Object}
     */
    isBlockModNoBlock: {
        isBlockMod: true,
        message: (options) => 'A block' + options.mod + 'mod' + options.mod + 'val specified, but block not found',

        valid: function(bemNaming, input, source) {
            var valid = true,
                bemObj = bemNaming.parse(input) || {};

            for (var i = source.length - 1; i >= 0; i--) {
                var className = source[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj ) {
                    if ( currentbemObj.block == bemObj.block && !currentbemObj.mod ) {
                        valid = true;
                        break;
                    } else {
                        valid = false;
                    }
                }
            }

            return valid;
        }
    },

    /**
     * Element mod should be only with it's element, wrong => class="b-block__element_mod"
     * @type {Object}
     */
    isElemModNoElement: {
        isElemMod: true,
        message: (options) => 'An element' + options.elem + 'mod' + options.mod + 'val specified, but element not found',
        valid: function(bemNaming, input, source) {
            var valid = true,
                bemObj = bemNaming.parse(input) || {};

            for (var i = source.length - 1; i >= 0; i--) {
                var className = source[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj ) {
                    if ( currentbemObj.block == bemObj.block && currentbemObj.elem && !currentbemObj.elem.mod ) {
                        valid = true;
                        break;
                    } else {
                        valid = false;
                    }
                }
            }

            return valid;
        }

    },
    /**
     * Element should be nested in it's block
     * @type {Object}
     */
    isBlockWrapElement: {
        isElem: true,
        message: (options) => 'Block of the element did not found',
        valid: function(bemNaming, input, source, $, bemlintId) {
            var valid = true,
                bemObj = bemNaming.parse(input);

                return !!$('#' + bemlintId).parents('.' + bemObj.block).length;
        }
    }
};

module.exports = allRules;
