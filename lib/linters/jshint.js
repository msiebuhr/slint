var JSHINT = require('jshint/src/jshint').JSHINT;

// Blatantly borrowed from https://github.com/jshint/jshint/blob/master/src/cli.js

function lint(filename, body, config, callback) {
    var globals,
        results = [],
        buffer = [];

    config = config || {};
    config = JSON.parse(JSON.stringify(config));

    /* TODO: Read prereq files async'ed if we use that feature
    if (config.prereq) {
        config.prereq.forEach(function (fp) {
            fp = path.join(config.dirname, fp);
            if (shjs.test("-e", fp))
            buffer.push(shjs.cat(fp));
        });
        delete config.prereq;
    }
    */

    if (config.globals) {
        globals = config.globals;
        delete config.globals;
    }

    delete config.dirname;
    buffer.push(body);
    buffer = buffer.join("\n");
    buffer = buffer.replace(/^\uFEFF/, ""); // Remove potential Unicode BOM.

    var lintResult;
    try {
        lintResult = JSHINT(buffer, config, globals);
    } catch (e) {
        // For some input jshint ends up throwing an exception. Try to carry on.
        // https://github.com/jshint/jshint/pull/1360
        // https://github.com/jshint/jshint/issues/1370
        results.push(e);
    }

    if (!lintResult) {
        JSHINT.errors.forEach(function (err) {
            if (err) {
                err.filename = filename || 'stdin';
                err.message = err.reason; // We use .message, jshint uses .reason
                results.push(err);
            }
        });
    }

    return callback(undefined, results);
}

module.exports = lint;
