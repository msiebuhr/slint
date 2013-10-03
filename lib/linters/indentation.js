/* Check indentation
 */

var RE_LEADING_WHITESPACE = /^\s*/,
    RE_MULTILINE_COMMENT = /\*(.|[\r\n])*?\*\//g,
    removeComments = function (string) {
        // Multiline comments content may be indented differently
        // Ignore their content, but keep ine numbers
        return string.replace(RE_MULTILINE_COMMENT, function (match) {
            return match.replace(/[^\n]/g, '');
        });
    };

module.exports = function (filename, body, config, callback) {
    var lines = removeComments(body).split(/\r?\n/),
        results = [],
        indentChar = '\t',
        indentNumber = 1;

    config = config || {};

    indentChar = config.indentChar || indentChar;
    indentNumber = !isNaN(config.indentNumber) ? config.indentNumber : indentNumber;

    lines.forEach(function (line, lineIdx) {
        var indent = line.match(RE_LEADING_WHITESPACE)[0];

        if (indent) {
            indent.split('').forEach(function (char, charIdx) {
                if (char !== indentChar) {
                    results.push({
                        filename: filename,
                        line: lineIdx + 1,
                        character: charIdx,
                        message: 'Mixed tabs and spaces.',
                        context: line
                    });
                }
            });

            if (indent.length % indentNumber !== 0) {
                results.push({
                    filename: filename,
                    line: lineIdx + 1,
                    character: indent.length,
                    message: 'Invalid number of intentation chars.',
                    context: line
                });
            }
        }
    });

    return callback(undefined, results);
};
