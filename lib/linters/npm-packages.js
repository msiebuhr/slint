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
    if (!fs.existsSync(nodeModulesPath)) {
        return callback('Path', nodeModulesPath, 'doesn\'t exist');
    }

    // Read node_modules and see the versions
    exec('npm list --depth=1 --json', {
        cwd: projectPath
    }, function (error, stdout, stderr) {
        // This gives tonnes of errors by default. We ignore those.

        // Parse stdout
        var npmOut = JSON.parse(stdout);

        //console.log(npmOut.dependencies);
        //console.log(packageJson.dependencies);

        // Figure out what packages in what versions we expect.
        var expectedPackages = {};

        ['dependencies', 'devDependencies', 'optionalDependencies'].forEach(function (propertyName) {
            var versionByPackageName = packageJson[propertyName],
                type = typeof versionByPackageName;
            if (type !== 'undefined') {
                if (versionByPackageName && type === 'object') {
                    Object.keys(versionByPackageName).forEach(function (packageName) {
                        expectedPackages[packageName] = versionByPackageName[packageName];
                    });
                }
            }
        });

        var errors = [];

        function addError(msg) {
            errors.push({
                filename: packageJsonPath,
                message: msg,
                line: 0,
                character: 0
            });
        }

        // Check installed packages
        for (packageName in expectedPackages) {
            // Check package is on disk
            if (!(packageName in npmOut.dependencies) || npmOut.dependencies[packageName].missing) {
                addError("Package " + packageName + " is not installed.");
                continue;
            }

            // Compare version
            var targetVersion = expectedPackages[packageName],
                currentVersion = npmOut.dependencies[packageName].version;
            //info('Checking', packageName + ':', targetVersion, 'is satisfied by', currentVersion);
            if (!semver.satisfies(currentVersion, targetVersion)) {
                addError("package.json: Package " + packageName + " shoule be v" + targetVersion + " but is v" + currentVersion + ".");
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
};




// vi: filetype=javascript
