/* Very basic reporter */
var Stream = require('stream').Stream,
    util = require('util');

module.exports = function (results, options) {
    var s = new Stream();
    s.readable = true;

    process.nextTick(function () {
        results.forEach(function (result) {
            s.emit('data',
                result.filename +
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
