var assert = require('chai').assert,
    gfr = require('../lib/gitFileResolver');

/*global describe, it*/

var testTable = [{
    files: ['**/*.js'],
    name: 'returns only js-files',
    test: function (files, done) {
        files.forEach(function (f) { assert.match(f, /\.js$/); });
        done();
    }
},{
    files: ['**/*.js', '!node_modules'],
    name: 'returns nothing in node_modules',
    test: function (files, done) {
        files.forEach(function (f) { assert.notInclude(f, 'node_modules'); });
        done();
    }
},{
    files: ['*.fake_ext'],
    name: 'returns no files',
    test: function (files, done) {
        assert.lengthOf(files, 0);
        done();
    }
},{
    files: ['bin/*'],
    name: 'returns (at least) bin/slint',
    test: function (files, done) {
        assert.include(files, 'bin/slint');
        done();
    }
}, {
    files: ['package.json'],
    name: 'retuns only that file',
    test: function (files, done) {
        assert.deepEqual(files, ['package.json']);
        done();
    }
},{
    files: ['**', '!**/*.js'],
    name: 'returns no js-files',
    test: function (files, done) {
        assert.operator(files.length, '>', 0);
        files.forEach(function (f) {
            assert.notMatch(f, /\.js$/);
        });
        done();
    }
}];

describe('gitFileResolver()', function () {
    testTable.forEach(function (test) {
        it(JSON.stringify(test.files) + ' ' + test.name, function (done) {
            // Execute the match and test the results
            gfr(test.files, function (err, files) {
                if (err) { return done(err); }
                assert.isArray(files, "Didn't return an array");
                files.forEach(function (file) {
                    assert.isString(file, "Returned non-string array element.");
                });
                test.test(files, done);
            });
        });
    });
});
