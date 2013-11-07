var assert = require('chai').assert,
    Path = require('path'),
    fs = require('fs'),
    npmPackages = require('../../lib/linters/npm-packages');

/*global describe, it*/

describe('npm-packages', function () {
    describe('in a project with an installed package listed under optionalDependencies', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'optionalDependencies'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output zero errors', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 0);
                done(err);
            });
        });
    });
});
