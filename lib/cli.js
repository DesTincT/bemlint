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
    CLIEngine = require("./cli-engine");


function formatResults(results){
    var output = "",
        total = 0;

    results.forEach(function(result) {

        var messages = result.messages;
        total += messages.length;

        messages.forEach(function(message) {

            output += result.filePath + ": ";
            output += "line " + (message.line || 0);
            output += ", col " + (message.column || 0);
            output += ", Warning";
            output += " - " + message.message;
            output += "\n";

        });

    });

    return output;
}

/**
 * Outputs the results of the linting.
 * @param {LintResult[]} results The results to print.
 * @param {string} outputFile The path for the output file.
 * @returns {boolean} True if the printing succeeds, false if not.
 * @private
 */
function printResults(results, outputFile) {
    var formatter,
        output = results,
        filePath;

    output = formatResults(results);

    if (output) {
        if (outputFile) {
            filePath = path.resolve(process.cwd(), outputFile);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                console.error("Cannot write to output file path, it is a directory: %s", outputFile);
                return false;
            }

            try {
                mkdirp.sync(path.dirname(filePath));
                fs.writeFileSync(filePath, output);
            } catch (ex) {
                console.error("There was a problem writing the output file:\n%s", ex);
                return false;
            }
        } else {
            console.info(output);
        }
    }

    return true;

}


var cli = {

    execute: function(args) {

        var currentOptions,
            files,
            report,
            parser;

        try {
            currentOptions = optionator.parse(args);
        } catch (error) {
            console.error(error.message);
            return 1;
        }

        files = currentOptions._;

        if (currentOptions.version) { // version from package.json

            console.info("v" + require("../package.json").version);

        } else if (currentOptions.help || (!files.length)) {

            console.info(optionator.generateHelp());

        } else {

            debug("Running on files");

            parser = new CLIEngine(currentOptions);

            report = parser.executeOnFiles(files);

            if ( printResults(report.results, currentOptions.outputFile) ) {

                return report.errorCount ? 1 : 0;

            } else {
                return 1;
            }

        }

        return 0;
    }
};

module.exports = cli;
