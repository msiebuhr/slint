var assert = require('chai').assert,
    sinon = require('sinon'),
    SlintParser = require('../lib/SlintParser');

/*global describe, it*/

describe('SlintParser()', function () {
    var parser;

    beforeEach(function () {
        parser = new SlintParser([{
            tool: 'jshint',
            config: {foo: 'bar'},
            files: ['test/**/*.js']
        }]);
    });

    it('Has the given blob on _data', function () {
        assert.property(parser, '_data');
        assert.deepEqual(parser._data, [{
            tool: 'jshint',
            config: {foo: 'bar'},
            files: ['test/**/*.js']
        }]);
    });

    it('.emitLintings() makes it emit linter-instructions', function (done) {
        var lintSpy = sinon.spy(),
            endSpy = sinon.spy();

        parser.on('lint', lintSpy);
        parser.on('end', endSpy);
        parser.on('error', done);

        parser.emitLintings(function (err, lintings) {
            if (err) { return done(err); }
            assert(lintSpy.called);
            assert(endSpy.calledOnce)
            done();
        });
    });

});
