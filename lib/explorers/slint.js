/* Find slint.json files and output what to lint
 *
 * TODO: Pry the discovery algorithm from the cold grasp of bin/slint
 * TODO: Make it run recursively
 */

module.exports = function (fs, cwd, callback) {
    fs.readFile('slint.json', 'utf-8', function (err, data) {
        if (err) { return callback(undefined, []); }

        // bla bla bal
        var lintingToDo = [];
        return callback(undefined, lintingToDo);
    });
};
