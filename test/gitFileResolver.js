var expect = require('unexpected'),
    gfr = require('../lib/gitFileResolver');

/*global describe, it*/

var testTable = [{
    files: ['**/*.js'],
    name: 'returns only js-files',
    test: function (files, done) {
        files.forEach(function (f) { expect(f, 'to match', /\.js$/); });
        done();
    }
},{
    files: ['**/*.js', '!node_modules'],
    name: 'returns nothing in node_modules',
    test: function (files, done) {
        files.forEach(function (f) { expect(f, 'not to contain', 'node_modules'); });
        done();
    }
},{
    files: ['*.fake_ext'],
    name: 'returns no files',
    test: function (files, done) {
        expect(files, 'to be empty');
        done();
    }
},{
    files: ['bin/*'],
    name: 'returns (at least) bin/slint',
    test: function (files, done) {
        expect(files, 'to contain', 'bin/slint');
        done();
    }
}, {
    files: ['package.json'],
    name: 'retuns only that file',
    test: function (files, done) {
        expect(files, 'to equal', ['package.json']);
        done();
    }
},{
    files: ['**', '!**/*.js'],
    name: 'returns no js-files',
    test: function (files, done) {
        expect(files, 'to be an array');
        expect(files, 'not to be empty');
        files.forEach(function (f) {
            expect(f, 'not to match', /\.js$/);
        });
        done();
    }
},{
    files: ['**'],
    name: 'returns no directories',
    test: function (files, done) {
        var fs = require('fs');
        files.forEach(function (f) {
            expect(fs.statSync(f).isFile(), 'to be true', f + ' is not a file!');
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
                expect(files, 'to be an array');
                files.forEach(function (file) {
                    expect(file, 'to be a string');
                });
                test.test(files, done);
            });
        });
    });
});
