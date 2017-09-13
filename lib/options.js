/**
 * @fileoverview Options for cli generator
 * @author Ivan Sobolev
 */

"use strict";

module.exports = require("optionator")({
    prepend: "bemlint [options] file.html [file.html]",
    defaults: {
        concatRepeatedArrays: true,
        mergeRepeatedObjects: true
    },
    options: [
        {
            heading: "Basic configuration"
        },
        {
            option: "help",
            alias: "h",
            type: "Boolean",
            description: "Display help"
        },
        {
            option: "version",
            alias: "v",
            type: "Boolean",
            description: "Outputs the version"
        },
        {
            heading: "BEM-naming"
        },
        {
            option: "elem",
            alias: "e",
            type: "String",
            default: "__",
            description: "Element delimeter"
        },
        {
            option: "mod",
            alias: "m",
            type: "String",
            default: "_",
            description: "Mod delimeter"
        },
        {
            option: "wordPattern",
            alias: "wp",
            type: "String",
            default: "[a-z0-9]+(?:-[a-z0-9]+)*",
            description: "Regex defines which symbols can be used for block, element and modifier's names"
        },
        {
            option: "bem-prefixes",
            alias: "bp",
            type: "Array",
            description: "Array of block names prefix to lint",
            example: "['b-', 'l-', 'helper-']"
        },
        {
            option: "exclude-selectors",
            alias: "es",
            type: "Array",
            description: "Array of selectors, which will be removed from validating.",
            default: "['code *']",
            example: "['code *', '.no-bemname-validate']"
        },

        {
            heading: "Ignoring files"
        },
        {
            option: "ignore-path",
            type: "path::String",
            description: "Specify path of ignore file"
        },
        {
            option: "ignore",
            type: "Boolean",
            default: "true",
            description: "Disable use of .bemlintignore"
        },
        {
            option: "ignore-pattern",
            type: "[String]",
            description: "Pattern of files to ignore (in addition to those in .bemlintignore)",
            concatRepeatedArrays: [true, { oneValuePerFlag: true }]
        },

        {
            option: "exclude-rules",
            alias: "er",
            type: "Array",
            description: "Array of rules ids to exclude from lint",
            example: "['dublicate']"
        },

        {
            option: "format",
            alias: "f",
            type: "String",
            default: "stylish",
            description: "Use a specific output format (compact|checkstyle|html|json|table|tap|unix|visualstudio|junit|jslint-xml|html-template-message|html-template-page|html-template-result)"
        },

        {
            option: "config",
            alias: "c",
            type: "String",
            description: "Config file",
            example: "--config .bemlint.json"
        },

    ]
});

