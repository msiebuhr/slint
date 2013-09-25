/* A parser for slint.json files
 */

var _ = require('underscore'),
    async = require('async'),
    EventEmitter = require('events').EventEmitter,
    gitFileResolver = require('./gitFileResolver'),
    util = require('util'),
    fs = require('./fs');

function SlintParser(dataOrPath) {
    EventEmitter.call(this);
    this._data;

    if (_.isString(dataOrPath)) {
        this._filename = dataOrPath;
    } else {
        this._filename = '<data>'
        this._data = dataOrPath;
    }
}

util.inherits(SlintParser, EventEmitter);

// TODO: Check linters exist
// TODO: Load configurations
SlintParser.prototype.ensureDataIsLoaded = function (cb) {
    if (this._data) { return cb(undefined, this._data); }

    var that = this;
    fs.readFile(this._filename, 'utf-8', function (err, text) {
        if (err) { return cb(err); }
        try {
            this._data = JSON.parse(text);
        } catch (e) {
            return cb(e);
        }

        return cb(undefined, this._data);
    });
}

SlintParser.prototype.lintingsFromDirective = function (directive, cb) {
    var tool = directive.tool,
        files = directive.files || ['**'],
        config = directive.config || {};

    try {
        linter = require('../lib/linters/' + tool);
    } catch (e) {
        return cb(new Error('Failed loading "' + tool + '": ' + e.message));
    }

    gitFileResolver(files, function (err, files) {
        if (err) { return cb(err, []); }

        var res = files.map(function (fileName) {
            return {
                filename: fileName,
                tool: linter,
                toolName: tool,
                config: config
            };
        });

        return cb(undefined, res);
    });

};

/* Emit `(filename, lint-tool, configuration)` as they are being read.
 */
SlintParser.prototype.emitLintings = function (cb) {
    cb = cb || function () {};

    var that = this;
    this.ensureDataIsLoaded(function (err, data) {
        async.map(data, function (directive, callback) {
            that.lintingsFromDirective(directive, function (err, lintings) {
                if (err) { return callback(err); }

                lintings.forEach(function (linting) {
                    that.emit('lint', linting);
                });

                return callback(err, lintings);
            }); 
        }, function (err, lintings) {
            that.emit('end');
            if (err) {
                that.emit('error', err);
            }

            // Return normally
            return cb(err, _.flatten(lintings));
        });
    });
}

module.exports = SlintParser;
