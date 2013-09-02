/* GIT-ignore/glob file resolver
 *
 * Priorities:
 * - Resolve explicit file-names (FILENAME.EXT)
 * - Load ignore-patterns (!NOT_THIS, !*.NOT_EXT)
 * - Resolve simple shell-patterns (DIR/*)
 * - Expand glob-patterns (Things with **.EXT)
 *
 * For now, we just use glob and then filter out results. If that doesn't work
 * (either matching doesn't feel right or not fast enough), we may want to
 * redo it.
 *
 * Glob doesn't do ignores quite the way we like, but minmatch does seem to
 * implement most of what we want, so we could 'just' add some code to apply
 * ignore-patterns early + multiple arguments.
 */

var async = require('async'),
    minimatch = require('minimatch'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path');


function isIgnored(filename, ignores) {
    return ignores.some(function (ignore) {
        // If the ignore-pattern is in the path somewhere...
        if (filename.indexOf(ignore) !== -1) {
            return true;
        }

        // Old, Narrow version of the above...
        //if (path.basename(filename) === ignore) { return true; }

        if (minimatch(filename, ignore, { nocase: true })) {
            return true;
        }

        return false;
    });
}

function resolve(matchList, callback) {
    // Split out ignore-patterns
    var okList = [],
        ignoreList = [];

    for (var i = 0; i< matchList.length; i += 1) {
        if (matchList[i][0] === '!') {
            ignoreList.push(matchList[i].substr(1));
        } else {
            okList.push(matchList[i]);
        }
    }

    return async.map(okList, function (match, cb) {
        // Stat it!
        fs.stat(match, function (err, stats) {
            // If it stat'ed successfully and it's a file
            if (stats && stats.isFile()) {
                return callback(undefined, [match]);
            }

            // GLOB IT!
            glob(match, {}, function (err, files) {
                files = files.filter(function (file) {
                    var i = isIgnored(file, ignoreList);
                    return !i;
                });
                return cb(err, files);
            });
        });
    }, function (err, res) {
        // Collect results
        // TODO: De-duplicate
        return callback(err, Array.prototype.concat.apply([], res));
    });
}

module.exports = resolve;
