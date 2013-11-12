var expect = require('unexpected'),
    fs = require('fs');

/*global describe, it*/

var basicTests = {
    'trailing-spaces': {
        ok: 'bar\nbaz\n',
        fail: 'bar \nbaz\n'
    },
    'finalnewline': {
        ok: 'foo\nbar\n',
        fail: 'foo\nbar'
    },
    'indentation': {
        ok: '\tfoo\n\t\tbar',
        fail: ' \tfoo\n\t bar'
    },
    'jshint': {
        ok: 'return 1+1;',
        fail: 'return return'
    },
    'json': {
        ok: '{"foo": "bar"}',
        fail: '{x}'
    },
    less: {
        ok: "@base: #fff;",
        fail: '@import "foobar"'
    },
    'npm-packages': {
        ok: fs.readFileSync('./package.json', 'utf-8'),
        fail: '{}'
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
                expect(errors, 'to be an array');
                expect(errors, 'to be empty');
                done(err);
            });
        });

        describe('Bad data', function () {
            var errList;

            before(function (done) {
                l('fileName', basicTests[testName].fail, {}, function (err, errors) {
                    expect(errors, 'to be an array');
                    errList = errors;
                    done(err);
                });
            });

            it('Returns at least one error', function () {
                expect(errList.length, 'to be greater than', 0);
            });

            it('Has .filename = <given filename>', function () {
                errList.forEach(function (err) {
                    expect(err, 'to have property', 'filename', 'fileName');
                });
            });

            it('Has .line = <some nubmer>', function () {
                errList.forEach(function (err) {
                    expect(err, 'to have property', 'line');
                    expect(err.line, 'to be a number');
                });
            });

            it('Has .character = <some number>', function () {
                errList.forEach(function (err) {
                    expect(err, 'to have property', 'character');
                    expect(err.character, 'to be a number');
                });
            });

            it('Has .message = <some string>.', function () {
                errList.forEach(function (err) {
                    expect(err, 'to have property', 'message');
                    expect(err.message, 'to be a string');
                    expect(err.message, 'to match', /\.$/);
                });
            });
        });
    });
}
