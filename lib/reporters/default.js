/* Very basic reporter */
var Stream = require('stream').Stream,
    Path = require('path'),
    util = require('util');

module.exports = function (results, options) {
    var s = new Stream();
    s.readable = true;

    options = options || {};

    // This needs to work even though options.baseDir is in one of the virtual .git/gitFakeFs/... folders:
    function makeFileNameRelativeToCwd(filename) {
        if (options.baseDir && options.projectDir) {
            return Path.relative(process.cwd(), Path.resolve(options.projectDir, Path.relative(options.baseDir, filename)));
        } else {
            return filename;
        }
    }

    process.nextTick(function () {
        results.forEach(function (result) {
            s.emit('data',
                makeFileNameRelativeToCwd(result.filename) +
                ": line " + result.line +
                ", col " + result.character +
                ", " + result.message +
                "\n"
            );
        });
        s.emit('end');
    });

    return s;
};
