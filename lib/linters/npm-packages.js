var exec = require('child_process').exec,
    fs = require('fs'),
    semver = require('semver'),
    path = require('path');


module.exports = function (packageJsonPath, packageJsonRaw, config, callback) {
    // Read package.json
    var packageJson;
    try {
        packageJson = JSON.parse(packageJsonRaw);
    } catch (e) {
        return callback('Could not parse package.json');
    }

    // Run NPM to find version of local packages
    var projectPath = path.dirname(packageJsonPath);
    var nodeModulesPath = path.resolve(projectPath, 'node_modules');

    // Figure out what packages in what versions we expect.
    var expectedPackages = {};
    var errors = [];

    function addError(msg) {
        errors.push({
            filename: packageJsonPath,
            message: msg,
            line: 0,
            character: 0
        });
    }

    ['dependencies', 'devDependencies', 'optionalDependencies'].forEach(function (propertyName) {
        var versionByPackageName = packageJson[propertyName],
            type = typeof versionByPackageName;
        if (type !== 'undefined') {
            if (versionByPackageName && type === 'object') {
                Object.keys(versionByPackageName).forEach(function (packageName) {
                    var version = versionByPackageName[packageName];
                    if (packageName in expectedPackages) {
                        var existingVersion = expectedPackages[packageName].version;
                        addError(propertyName + ': The package ' + packageName + ' was already listed in the ' + expectedPackages[packageName].section + ' section' +
                                 (existingVersion === version ? '' : ', and with a different version specifier (' + existingVersion + ' vs. ' + version + ')'));
                    } else {
                        expectedPackages[packageName] = {section: propertyName, version: version};
                    }
                });
            } else {
                addError('The ' + propertyName + ' property should be an object if present');
            }
        }
    });

    fs.stat(nodeModulesPath, function (err, stats) {
        if (err && err.code === 'ENOENT' && Object.keys(expectedPackages).length === 0) {
            // The node_modules folder wasn't found, but that's OK because package.json doesn't list any dependencies
            return callback(undefined, errors);
        } else if (err) {
            return callback(new Error('Cannot stat ' + nodeModulesPath + ': ' + err.message), errors);
        } else if (!stats.isDirectory()) {
            return callback(new Error(nodeModulesPath + ' is not a directory'), errors);
        } else {
            // Read node_modules and see the versions
            exec('npm list --depth=1 --json', {
                cwd: projectPath
            }, function (error, stdout, stderr) {
                // This gives tonnes of errors by default. We ignore those.

                // Parse stdout
                var npmOut = JSON.parse(stdout);

                //console.log(npmOut.dependencies);
                //console.log(packageJson.dependencies);

                // Check installed packages
                for (packageName in expectedPackages) {
                    var targetVersion = expectedPackages[packageName].version;
                    // Check package is on disk
                    if ((!(packageName in npmOut.dependencies) || npmOut.dependencies[packageName].missing)) {
                        if (expectedPackages[packageName].section !== 'optionalDependencies') {
                            addError('Package ' + packageName + ' is not installed (expected version: ' + targetVersion + ').');
                        }
                        continue;
                    }

                    // Compare version
                    var currentVersion = npmOut.dependencies[packageName].version;
                    //info('Checking', packageName + ':', targetVersion, 'is satisfied by', currentVersion);
                    if (!semver.satisfies(currentVersion, targetVersion)) {
                        addError("package.json: Package " + packageName + " should be v" + targetVersion + " but is v" + currentVersion + ".");
                        continue;
                    }
                }

                // Check we don't have any extra packages installed
                Object.keys(npmOut.dependencies).forEach(function (installedName) {
                    if (!(installedName in expectedPackages)) {
                        addError("package.json: Package '" + installedName + "' is installed, but not mentioned in package.json.");
                    }
                });

                return callback(undefined, errors);
            });
        }
    });
};




// vi: filetype=javascript
