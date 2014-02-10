/* Check for final newline
 */
module.exports = function (filename, body, config, callback) {
    var errors = [],
        lines = body.split('\n'),
        lastLine = lines[lines.length - 1],
        prevLastLine = lines[lines.length - 2];

    if (lastLine !== '') {
        errors.push({
            filename: filename,
            line: lines.length,
            character: lastLine.length,
            message: 'Missing final newline.',
            context: lastLine
        });
    } else if (prevLastLine === '') {
        errors.push({
            filename: filename,
            line: lines.length - 1,
            character: prevLastLine.length,
            message: 'More than one final newline.',
            context: prevLastLine
        });
    }

    return callback(undefined, errors);
};
