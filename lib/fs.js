var memoizeAsync = require('memoizeasync'),
    fs = require('fs');

module.exports.readdir = memoizeAsync(fs.readdir, {
    max: 10000,
    length: function (err, results) {
        return results ? results.length : 5; // Arbitrarily count memoized errors as equivalent to 5 items
    }
});

module.exports.readFile = memoizeAsync(fs.readFile, {
    max: 40 * 1024 * 1024,
    length: function (err, body) {
        if (Buffer.isBuffer(body) || typeof body === 'string') {
            // Should actually be Buffer.byteLength(body) for strings, but that would need to plow through the entire thing
            return body.length;
        }
        return 512; // Arbitrarily count memoized errors as equivalent to half a kilobyte
    }
});

module.exports.stat = memoizeAsync(fs.stat, {max: 10000});
