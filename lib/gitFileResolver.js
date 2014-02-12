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
    Path = require('path'), // Import with an upper case name so it's less likely to collide with a variable name
    minimatch = require('minimatch'),
    glob = require('glob-papandreou'),
    fs = require('fs');

function resolve(matchList, baseDir, callback) {
    // Split out ignore-patterns
    var okList = [],
        ignoreList = [];

    for (var i = 0; i < matchList.length; i += 1) {
        if (matchList[i][0] === '!') {
            ignoreList.push(matchList[i].substr(1));
        } else {
            okList.push(matchList[i]);
        }
    }

    return async.map(okList, function (match, cb) {
        // Stat it!
        fs.stat(Path.resolve(baseDir, match), function (err, stats) {
            // If it stat'ed successfully and it's a file
            if (stats && stats.isFile()) {
                return cb(undefined, [match]);
            }

            function isNotIgnored(filename) {
                return !ignoreList.some(function (ignore) {
                    if (minimatch(filename, ignore, { nocase: true })) {
                        return true;
                    }

                    return false;
                });
            }

            // GLOB IT!
            glob(match, { mark: true, cwd: baseDir, filter: isNotIgnored }, function (err, files) {
                files = files && files.filter(function (file) {
                    return file[file.length - 1] !== '/';
                });
                return cb(err, files);
            });
        });
    }, function (err, res) {
        // Collect results
        // TODO: De-duplicate
        return callback(err, !err && Array.prototype.concat.apply([], res));
    });
}

module.exports = resolve;
