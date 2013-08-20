var assert = require('chai').assert,
    trailingWhitespace = require('../../lib/linters/trailing-spaces');

/*global describe, it*/

describe('linters/trailing-witespace', function () {

    it('Lets OK data pass', function (done) {
        trailingWhitespace('foo', 'bar\nbaz\n', {}, function (err, errors) {
            assert.deepEqual(errors, []);
            done(err);
        });
    });

    it('Barfs on trailing spaces', function (done) {
        trailingWhitespace('foo', 'bar \nbaz\n', {}, function (err, errors) {
            assert.lengthOf(errors, 1);
            assert.propertyVal(errors[0], 'line', 1);
            assert.propertyVal(errors[0], 'char', 4);
            done(err);
        });
    });
});

