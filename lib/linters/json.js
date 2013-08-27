/* Check for valid JSON
 */

// Checks whether the keys in objects are in sorted order.
function isCanonicalObj(obj) {
    if (Array.isArray(obj)) {
        return obj.every(isCanonicalObj);
    } else if (typeof obj === 'object' && obj !== null) {
        var previousKey;
        for (var key in obj) {
            if (typeof previousKey !== 'undefined' && key < previousKey || !isCanonicalObj(obj[key])) {
                return false;
            }
            previousKey = key;
        }
    }
    return true;
}

module.exports = function (filename, body, config, callback) {
    var results = [],
        parsedObj;

    config = config || {};

    try {
        parsedObj = JSON.parse(body);
    } catch (e) {
        results.push({
            filename: filename,
            line: 0,
            character: 0,
            message: 'JSON does not parse.'
        });
    }

    if (typeof parsedObj !== 'undefined') {
        if ('canonical' in config && config.canonical && !isCanonicalObj(parsedObj)) {
            results.push({
                filename: filename,
                // We'll need a different JSON parser to get to this info:
                line: 0,
                character: 0,
                message: 'JSON is not canonical'
            });
        }
        if ('indent' in config) {
            var reserializedJson = JSON.stringify(parsedObj, undefined, config.indent);

            // Tolerate differences in trailing new lines and carriage returns when comparing to the expected output
            // (that is better handled by the trailing-spaces linter):
            if (reserializedJson.replace(/[\r\n]+$/, '') !== body.replace(/[\r\n]+$/, '')) {
                results.push({
                    filename: filename,
                    // We'll need a different JSON parser to get to this info:
                    line: 0,
                    character: 0,
                    message: 'JSON is not indented correctly'
                });
            }
        }
    }

    callback(undefined, results);
};
