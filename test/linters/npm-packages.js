var expect = require('unexpected'),
    Path = require('path'),
    fs = require('fs'),
    npmPackages = require('../../lib/linters/npm-packages');

/*global describe, it*/

function loadTestCase(testName, cb) {
    var projectDirectory = Path.resolve(__dirname, 'npm-packages', testName),
        packageJsonPath = Path.resolve(projectDirectory, 'package.json');

    fs.readFile(packageJsonPath, 'utf-8', function (err, packageJsonStr) {
        if (err) {
            return cb(err);
        }
        npmPackages(packageJsonPath, packageJsonStr, {}, cb);
    });
}

describe('npm-packages', function () {
    it('should produce no errors when an installed package is listed under optionalDependencies', function (done) {
        loadTestCase('optionalDependencies', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to be empty');
            done(err);
        });
    });

    it('should produce no errors when no dependencies are listed in package.json and there is no node_modules folder', function (done) {
        loadTestCase('noDependenciesAndNoNodeModules', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to be empty');
            done(err);
        });
    });

    it('should produce an error when the dependencies property has a non-object value', function (done) {
        loadTestCase('nonObjectDependencies', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to have length', 1);
            expect(results[0].message, 'to equal', 'The dependencies property should be an object if present');
            done(err);
        });
    });

    it('should produce errors when the same packages are listed twice in different sections', function (done) {
        loadTestCase('sameDependencyListedTwice', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to have length', 2);
            expect(results[0].message, 'to equal', 'devDependencies: The package a was already listed in the dependencies section, and with a different version specifier (1.2.3 vs. 1.4.7)');
            expect(results[1].message, 'to equal', 'optionalDependencies: The package b was already listed in the dependencies section');
            done(err);
        });
    });

    it('should produce an error when a listed dependency is not installed in node_modules', function (done) {
        loadTestCase('dependencyNotInstalled', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to have length', 1);
            expect(results[0].message, 'to equal', 'Package b is not installed (expected version: 2.0.0).');
            done(err);
        });
    });

    it('should produce no errors when an optional dependency is not installed in node_modules', function (done) {
        loadTestCase('optionalDependencyNotInstalled', function (err, results) {
            expect(results, 'to be an array');
            expect(results, 'to be empty');
            done(err);
        });
    });
});
