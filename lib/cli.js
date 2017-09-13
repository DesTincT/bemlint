/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

"use strict";

/*
 * The CLI object should *not* call process.exit() directly. It should only return
 * exit codes. This allows other programs to use the CLI object and still control
 * when the program exits.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    debug = require("debug"),
    optionator = require("./options"),
    CLIEngine = require("./cli-engine"),
    log = require("./logging");

/**
 * Outputs the results of the linting.
 * @param {CLIEngine} engine The CLIEngine to use.
 * @param {LintResult[]} results The results to print.
 * @param {string} format The name of the formatter to use or the path to the formatter.
 * @param {string} outputFile The path for the output file.
 * @returns {boolean} True if the printing succeeds, false if not.
 * @private
 */
function printResults(engine, results, format, outputFile) {
    var formatter,
        output,
        filePath;

    formatter = engine.getFormatter(format);

    if (!formatter) {
        log.error("Could not find formatter '%s'.", format);
        return false;
    }

    output = formatter(results);

    if (output) {
        if (outputFile) {
            filePath = path.resolve(process.cwd(), outputFile);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                log.error("Cannot write to output file path, it is a directory: %s", outputFile);
                return false;
            }

            try {
                mkdirp.sync(path.dirname(filePath));
                fs.writeFileSync(filePath, output);
            } catch (ex) {
                log.error("There was a problem writing the output file:\n%s", ex);
                return false;
            }
        } else {
            log.info(output);
        }
    }

    return true;

}



var cli = {

    execute: function(args) {

        var currentOptions,
            files,
            report,
            engine;

        try {
            currentOptions = optionator.parse(args);
        } catch (error) {
            console.error(error.message);
            return 1;
        }

        files = currentOptions._;

        if ( currentOptions.config ) {
            Object.assign(currentOptions, currentOptions, require(currentOptions.config));
        }

        if (currentOptions.version) { // version from package.json

            console.info("v" + require("../package.json").version);

        } else if (currentOptions.help || (!files.length)) {

            console.info(optionator.generateHelp());

        } else {

            debug("Running on files");

            engine = new CLIEngine(currentOptions);

            report = engine.executeOnFiles(files);

            if ( printResults(engine, report.results, currentOptions.format, currentOptions.outputFile) ) {

                return report.errorCount ? 1 : 0;

            } else {
                return 1;
            }

        }

        return 0;
    }
};

module.exports = cli;
