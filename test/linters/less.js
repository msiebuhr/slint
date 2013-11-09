var assert = require('chai').assert,
    Path = require('path'),
    fs = require('fs'),
    less = require('../../lib/linters/less');

/*global describe, it*/

function loadTestCase(lessFileName, cb) {
    var lessPath = Path.resolve(__dirname, 'less', lessFileName);
    fs.readFile(lessPath, 'utf-8', function (err, lessStr) {
        if (err) {
            return cb(err);
        }
        less(lessPath, lessStr, {}, cb);
    });
}

describe('less', function () {
    it('should produce an error when a missing file is referenced in an @import', function (done) {
        loadTestCase('importedFileNotFound.less', function (err, results) {
            assert.isArray(results);
            assert.equal(results.length, 1);
            assert.equal(results[0].message, "'notFound.less' wasn't found.");
            done(err);
        });
    });

    it('should produce an error when a file has a syntax error', function (done) {
        loadTestCase('syntaxError.less', function (err, results) {
            assert.isArray(results);
            assert.equal(results.length, 1);
            assert.equal(results[0].message, 'missing opening `{`.');
            assert.equal(results[0].filename, Path.resolve(__dirname, 'less', 'syntaxError.less'));
            done(err);
        });
    });

    it('should produce an error when an imported file has a syntax error', function (done) {
        loadTestCase('syntaxErrorInImportedFile.less', function (err, results) {
            assert.isArray(results);
            assert.equal(results.length, 1);
            assert.equal(results[0].message, 'missing opening `{`.');
            assert.equal(results[0].filename, Path.resolve(__dirname, 'less', 'syntaxError.less'));
            done(err);
        });
    });

    it('should produce an error when an undefined variable is referenced', function (done) {
        loadTestCase('undefinedVariableReferenced.less', function (err, results) {
            assert.isArray(results);
            assert.equal(results.length, 1);
            assert.equal(results[0].message, 'variable @foo is undefined.');
            done(err);
        });
    });
});
