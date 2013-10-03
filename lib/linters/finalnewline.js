/* Check for final newline
 */
module.exports = function (filename, body, config, callback) {
    var errors = [],
        lines = body.split('\n'),
        lastLine = lines[lines.length - 1];

    if (lastLine !== '') {
        errors.push({
            filename: filename,
            line: lines.length,
            character: lastLine.length,
            message: 'Missing final newline.',
            context: lastLine
        });

    }

    return callback(undefined, errors);
};
