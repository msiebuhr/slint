/* Very basic reporter */
var Stream = require('stream').Stream;

module.exports = function (results, options) {
    var s = new Stream(),
        lookup = {};

    s.readable = true;

    results.forEach(function (result) {
        var name = result.filename;

        if (!lookup[name]) {
            lookup[name] = [];
        }

        lookup[name].push(result);
    });

    s.emit('data', '<?xml version="1.0" encoding="utf-8"?>\n');
    s.emit('data', '<checkstyle version="4.3">\n\n');

    Object.keys(lookup).forEach(function (filename) {
        s.emit('data', '\t<file name="' + filename + '">\n');

        lookup[filename].forEach(function (e) {
            s.emit('data', '\t\t<error line="' + e.line + '" column="' + e.character + '" severity="warning" message="' + e.message + '" source="slint" />\n');
        });

        s.emit('data', '\t</file>\n\n');
    });


    s.emit('data', '</checkstyle>\n');

    return s;
};
