/* Very basic reporter */

module.exports = function (results, options, outStream) {
    results.forEach(function (result) {
        outStream.write(
            result.filename +
            ": line " + result.line +
            ", col " + result.character +
            ", " + (result.reason || result.message) +
            "\n"
        );
    });
};
