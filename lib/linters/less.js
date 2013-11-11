var less = require('less-papandreou'),
    Path = require('path');

module.exports = function (filename, body, config, callback) {

    function prepareLessError(err) {
        // Add missing meta-data
        err.character = typeof err.column === 'number' ? err.column : 0;

        // TODO: With recursive imports, LESS doesn't give the root file it parsed.
        //err.sourceFileName = filename;

        // If the less error include a few lines of context, append them to err.message.
        // Disabled because it violates the test that wants err.message to end with a newline.
        if (false && err.extract) {
            err.message += ':\n' + err.extract.join('\n');
        } else {
            // Ensure message ends with a dot.
            if (!/\.$/.test(err.message)) { err.message += '.'; }
        }
        if (err.filename === 'input') {
            err.filename = filename;
        }
        return err;
    }

    var parseOptions = {
            paths: [Path.dirname(filename)]//,
//            filename: filename
        },
        parser = new less.Parser(parseOptions),
        results = [];

    parser.parse(body, function (err, tree) {
        if (err) {
            return callback(undefined, [prepareLessError(err)]);
        }

        try {
            // Compiling to CSS will throw in case of undefined @variables etc.:
            tree.toCSS();
        } catch (e) {
            return callback(undefined, [prepareLessError(e)]);
        }

        return callback(undefined, []);
    });
};
