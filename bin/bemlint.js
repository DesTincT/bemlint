#!/usr/bin/env node

"use strict";


var cli = require("../lib/cli");

var exitCode = 0;

exitCode = cli.execute(process.argv);


if ( "exitCode" in process ) {
    process.exitCode = exitCode;
} else {
    process.on("exit", function() {
        process.exit(exitCode);
    });
}
