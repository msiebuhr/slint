var expect = require('unexpected'),
    findFiles = require('../lib/findFiles');

/*global describe, it*/

describe('findFiles()', function () {
    it('Search for *.js in test/ returns on .js-files', function (done) {
        findFiles('test/', [], [ '.js' ], function (err, files) {
            if (err) { return done(err); }
            expect(files, 'to be an array');
            expect(files.length, 'to be greater than or equal to', 1);

            files.forEach(function (file) {
                expect(file, 'to match', /\.js$/);
            });

            done(err);
        });
    });

    it('Search __dirname for *.does-not-exist returns empty list', function (done) {
        findFiles(__dirname, [], [ '.does-not-exist' ], function (err, files) {
            if (err) { return done(err); }
            expect(files, 'to be an array');
            expect(files, 'to have length', 0);
            done(err);
        });
    });
});
