var expect = require('unexpected'),
    stream = require('stream');

/*global describe, it, before*/

// Generate a test-suite for the given linter.
function generateTests(reporterName) {
    describe('reporters/' + reporterName, function () {
        var r = require('../../lib/reporters/' + reporterName);

        it('Doesn\'t return anything without errors', function (done) {
            var outData = '';

            // Report!
            var out = r([], {});

            out.on('data', function (d) {
                outData += d;
            }).on('end', function () {
                // Check output
                expect(outData, 'to equal', '');
                done();
            });
        });

        describe('When given an error', function () {
            var outData = '';

            before(function (done) {
                // Report!
                r([{
                    filename: 'some/file',
                    line: 42,
                    character: 9,
                    message: 'Bam! It broke.'
                }], {})
                .on('data', function (d) { outData += d; })
                .on('end', function () {
                    done();
                });
            });

            it('Returns a non-empty string', function () {
                expect(outData, 'to be a string');
                expect(outData, 'not to equal', '');
            });

            it('Contains .filename somewhere', function () {
                expect(outData, 'to contain', 'some/file');
            });

            it('Contains .message somewhere', function () {
                expect(outData, 'to contain', 'Bam! It broke.');
            });

            it('Contains .line somewhere', function () {
                expect(outData, 'to contain', '42');
            });

            it('Contains .character somewhere', function () {
                expect(outData, 'to contain', '9');
            });

        });
    });
}

['default'].forEach(generateTests);
