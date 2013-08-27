var assert = require('chai').assert,
    stream = require('stream');

/*global describe, it*/

['default'].forEach(generateTests);

// Generate a test-suite for the given linter.
function generateTests(reporterName) {
    describe('reporters/' + reporterName, function () {
        var r = require('../../lib/reporters/' + reporterName);

        it('Doesn\'t return anything without errors', function (done) {
            var outData = "";

            // Report!
            var out = r([], {});

            out.on('data', function (d) {
                outData += d;
            }).on('end', function () {
                // Check output
                assert.equal(outData, '');
                done();
            });
        });

        describe('When given an error', function () {
            var outData = "";

            before(function (done) {
                // Report!
                r([{
                    filename: 'some/file',
                    line: 42,
                    character: 9,
                    message: 'Bam! It broke.'
                }], {})
                .on('data', function (d) { outData += d; })
                .on('end', function () {done();});
            });

            it('Returns a non-empty string', function () {
                assert.isString(outData);
                assert.notEqual(outData, "");
            });

            it('Contains .filename somewhere', function () {
                assert.include(outData, 'some/file');
            });

            it('Contains .message somewhere', function () {
                assert.include(outData, 'Bam! It broke.');
            });

            it('Contains .line somewhere', function () {
                assert.include(outData, '42');
            });

            it('Contains .character somewhere', function () {
                assert.include(outData, '9');
            });

        });
    });
}
