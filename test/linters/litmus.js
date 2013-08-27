var assert = require('chai').assert;

var tests = [{
    linter: 'json',
    config: {
        canonical: false
    },
    data: '{"b": 1, "a": 1}',
    shouldPass: true
}, {
    linter: 'json',
    config: {
        canonical: true
    },
    data: '{"b": 1, "a": 1}',
    shouldPass: false
}];

describe('linters/litmus', function () {
    tests.forEach(function (test) {
        it(test.linter + " with " + test.data + " should " + (test.shouldPass ? 'pass' : 'fail'), function (done) {
            var l = require('../../lib/linters/' + test.linter);
            l('test', test.data, test.config, function (err, errList) {
                if (test.shouldPass) {
                    assert.lengthOf(errList, 0, 'Should not retun any errors.');
                } else {
                    assert.operator(errList.length, '>', 0, 'Should return errors.');
                }
                done(err);
            });
        });
    });
});
