/* Find slint.json files and output what to lint
 *
 * TODO: Pry the discovery algorithm from the cold grasp of bin/slint
 * TODO: Make it run recursively
 */

var _ = require('underscore'),
    gitFileResolver = require('../gitFileResolver'),
    SlintParser = require('../SlintParser'),
    async = require('async');

module.exports = function (fs, cwd, callback) {
    var p = new SlintParser('slint.json');
    p.emitLintings(function (err, lintings) {
        if (err) { return callback(err, []); }

        return callback(err, lintings || []);
    });
};
