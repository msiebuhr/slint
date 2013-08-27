/* Check for valid JSON
 */

module.exports = function (filename, body, config, callback) {
    var err;
    try {
        JSON.parse(body);
    } catch (e) {
        return callback(undefined, [{
            filename: filename,
            line: 0,
            character: 0,
            message: 'JSON does not parse.'
        }]);
    }

    return callback(undefined, []);
};
