var fs = require('fs');

fs
    .readdirSync(__dirname)
    .filter(function (name) {
        return name !== 'index.js' && name[0] !== '.';
    })
    .map(function (name) {
        return name.replace('.js', '');
    })
    .forEach(function (name) {
        module.exports[name] = require('./' + name);
    });
