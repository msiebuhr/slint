/* Find files using jshint-like lookup
 *
 * A rough, async version of the `collect`-function JSHint uses.
 * https://github.com/jshint/jshint/blob/master/src/cli.js#L230
 *
 * TODO: Gitignore-style file-finder
 *  - Files that are mentioned are returned without metion.
 *  - Directories are traversed for files with given extenstions.
 *  - Files/directories prefixed with ! are ignored.
 *
 * Returns (err, [list, of, files])
 */

var async = require('async'),
    minimatch = require('minimatch'),
    path = require('path'),
    fs = require('fs');

function isIgnored(filename, ignores) {
    return ignores.some(function (ignore) {
        if (path.basename(filename) === ignore) {
            return true;
        }

        if (minimatch(filename, ignore, { nocase: true })) {
            return true;
        }

        return false;
    });
}

function isMatched(filename, extensions) {
    return extensions.some(function (extension) {
        return filename.indexOf(extension) === (filename.length - extension.length);
    });
}

function collectRecursive(root, ignores, extensions, callback) {
    // TODO: Should we ignore this?
    if (isIgnored(root, ignores)) {
        return callback(undefined, []);
    }

    // Stat to see what it is.
    fs.stat(root, function (err, stats) {
        if (err) {
            return callback(undefined, []);
        }

        // Is it a file?
        if (stats.isFile()) {
            // TODO: Does it have the right extension?
            return callback(undefined, isMatched(root, extensions) ? [root] : []);
        }
        // Ignore symlinks, sockets, ...
        if (!stats.isDirectory()) {
            return callback(undefined, []);
        }

        // A directory, then
        fs.readdir(root, function (err, entries) {
            async.map(entries, function (entry, cb) {
                var entryPath = path.join(root, entry);
                collectRecursive(entryPath, ignores, extensions, function (err, res) {
                    return cb(err, res);
                });
            }, function (err, fileList) {
                callback(err, Array.prototype.concat.apply([], fileList));
            });
        });
    });
}

/* Special-cases the initial iteration, where files that doesn't match
 * extension is let through.
 */
function collect(root, ignores, extensions, callback) {
    fs.stat(root, function (err, stats) {
        if (err) {
            return callback(err);
        }

        if (stats.isFile()) {
            return callback(undefined, [root]);
        }

        return collectRecursive(root, ignores, extensions, callback);
    });
}

module.exports = collect;
