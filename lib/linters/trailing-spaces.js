/* Check for trailing spaces
 */
module.exports = function (filename, body, config, callback) {
    var re = /\s$/,
        lines = body.split('\n'),
        errors = [];

    for (var i = 0; i < lines.length; i += 1) {
        if (re.test(lines[i])) {
            errors.push({
                filename: filename,
                line: i + 1,
                character: lines[i].length,
                message: 'Trailing whitespace.',
                context: lines[i]
            });
        }
    }

    return callback(undefined, errors);
};
