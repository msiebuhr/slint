var assert = require('chai').assert;

/*global describe, it*/

['default'].forEach(generateTests);

// Generate a test-suite for the given linter.
function generateTests(reporterName) {
    describe('reporters/' + reporterName, function () {
        var r = require('../../lib/reporters/' + reporterName);

        it('Doesn\'t return anything without errors');
        it('Outputs something when given an error');
    });
}
