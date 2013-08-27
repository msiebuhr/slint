var assert = require('chai').assert,
    trailingWhitespace = require('../../lib/linters/trailing-spaces');

/*global describe, it*/

var basicTests = {
    'trailing-spaces': {
        ok: 'bar\nbaz\n',
        fail: 'bar \nbaz\n'
    },
    'jshint': {
        ok: 'return 1+1;',
        fail: 'return return'
    }
};

// Loop through basic tests
for (var testName in basicTests) { generateTests(testName); }

// Generate a test-suite for the given linter.
function generateTests(testName) {
    describe('linters/' + testName, function () {
        var l = require('../../lib/linters/' + testName);

        it('Does not return errors on OK data', function (done) {
            l('fileName', basicTests[testName].ok, {}, function (err, errors) {
                assert.isArray(errors);
                assert.lengthOf(errors, 0);
                done(err);
            });
        });

        describe('Bad data', function () {
            var errList;

            before(function (done) {
                l('fileName', basicTests[testName].fail, {}, function (err, errors) {
                    assert.isArray(errors, 'Expected a list of errors.');
                    errList = errors;
                    done(err);
                });
            });

            it('Returns at least one error', function () {
                assert.operator(errList.length, '>', 0, 'Expected at least one error');
            });

            it('Has err.filename = fileName', function () {
                errList.forEach(function (err) {
                    assert.propertyVal(err, 'filename', 'fileName');
                });
            });

            it('Has .line = <some nubmer>', function () {
                errList.forEach(function (err) {
                    assert.property(err, 'line');
                    assert.isNumber(err.line);
                });
            });

            it('Has .character = <some number>', function () {
                errList.forEach(function (err) {
                    assert.property(err, 'character');
                    assert.isNumber(err.character);
                });
            });
        });
    });
}
