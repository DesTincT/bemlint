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
        message: (options) => 'Dublicate classes found',
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
            let valid = true,
                bemObj = bemNaming.parse(input);

            for (let i = source.length - 1; i >= 0; i--) {
                let className = source[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj && currentbemObj.block == bemObj.block &&
                    (
                        bemNaming.isBlock(input) && bemNaming.isElem(className) ||
                        bemNaming.isElem(input)  && bemNaming.isBlock(className)
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
            let valid = true,
                bemObj = bemNaming.parse(input);

            for (let i = source.length - 1; i >= 0; i--) {
                let className = source[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj ) {
                    if ( currentbemObj.block == bemObj.block && bemNaming.isBlock(className) ) {
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
            let valid = true,
                bemObj = bemNaming.parse(input);

            for (let i = source.length - 1; i >= 0; i--) {
                let className = source[i],
                currentbemObj = bemNaming.parse(className);

                if ( currentbemObj ) {
                    if ( currentbemObj.block == bemObj.block && bemNaming.isElem(className) ) {
                        valid = true;
                        break;
                    } else {
                        valid = false;
                    }
                }
            }

            return valid;
        }

    }
};

module.exports = allRules;
