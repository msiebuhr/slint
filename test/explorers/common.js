var assert = require('chai').assert,
    explorers = require('../../lib/explorers'),
    fs = require('fs');

/*global describe, it*/

// Try all explorers on this code-base and check they don't explode
describe('Explorers', function () {
    Object.keys(explorers).forEach(function (name) {
        describe('Basic test for ' + name, function () {
            var output,
                delay;

            before(function (done) {
                var start = Date.now();
                explorers[name](fs, undefined, function (err, linterList) {
                    delay = Date.now() - start;
                    output = linterList;
                    done(err);    
                });
            });

            it('Less than 100ms', function () {
                assert.operator(delay, '<', 100);
            });

            it('Outputs a list', function () {
                assert.isArray(output);
            });
        });
    });
});
