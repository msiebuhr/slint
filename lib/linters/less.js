var less = require('less');

module.exports = function (filename, body, config, callback) {
    var parseOptions = { filename: filename },
        parser = new (less.Parser)(parseOptions);
        results = [];

    parser.parse(body, function (err, tree) {
        if (err) {
            // Add missing meta-data
            err.character = 0;

            // TODO: With recursive imports, LESS doesn't give the root file it parsed.
            //err.sourceFileName = filename;

            // Ensure message ends with a dot.
            if (!err.message.match(/\.$/)) { err.message += '.'; }

            return callback(undefined, [err]);
        }

        return callback(undefined, []);
    });
};
