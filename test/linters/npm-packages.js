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

    describe('in a project with no dependencies listed in package.json and no node_modules folder', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'noDependenciesAndNoNodeModules'),
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

    describe('in a project with a package.json that has a dependencies property with a string value', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'nonObjectDependencies'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output one error', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 1);
                assert.equal(results[0].message, 'The dependencies property should be an object if present');
                done(err);
            });
        });
    });
});
