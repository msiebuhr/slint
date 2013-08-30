var assert = require('chai').assert,
    findFiles = require('../lib/findFiles');

/*global describe, it*/

describe('findFiles()', function () {
    it('Search for *.js in test/ returns on .js-files', function (done) {
        findFiles('test/', [], [ '.js' ], function (err, files) {
            if (err) { return done(err); }
            assert.isArray(files);
            assert.operator(files.length, '>=', 1);

            files.forEach(function (file) {
                assert.include(file, '.js');
            });

            done(err);
        });
    });

    it('Search __dirname for *.does-not-exist returns empty list', function (done) {
        findFiles(__dirname, [], [ '.does-not-exist' ], function (err, files) {
            if (err) { return done(err); }
            assert.isArray(files);
            assert.lengthOf(files, 0);
            done(err);
        });
    });
});
