var expect = require('unexpected'),
    Path = require('path'),
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
        expect(files, 'to be an array whose items satisfy', 'not to contain', 'node_modules');
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
        expect(files, 'to be a non-empty array whose items satisfy', 'not to match', /\.js$/);
        done();
    }
},{
    files: ['**'],
    name: 'returns no directories',
    test: function (files, done) {
        var fs = require('fs');
        expect(files, 'to be a non-empty array whose items satisfy', function (file) {
            expect(fs.statSync(file).isFile(), 'to be true', 'expected ' + file + ' to be a file');
        });
        done();
    }
}];

describe('gitFileResolver()', function () {
    testTable.forEach(function (test) {
        it(JSON.stringify(test.files) + ' ' + test.name, function (done) {
            // Execute the match and test the results
            gfr(test.files, Path.resolve(__dirname, '..'), function (err, files) {
                if (err) { return done(err); }
                expect(files, 'to be an array of strings');
                test.test(files, done);
            });
        });
    });
});
