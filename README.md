slint
=====

Lint-tool for web projects

What it does
------------

It takes a basic recipe of what linters you want to apply to which files (and,
optionally, the linter configuration):

    [
        {
            "tool": "jshint",
            "files": ["**/*.js", "!node_modules"],
        },
        {
            "tool": "trailing-whitespace",
            "files": ["**", "!node_modules"],
        },
        {
            "tool": "json",
            "files": ["**/*.json", "!node_modules"],
        }
    ]

Running the tool with this configuration file will use gitignore-style
expansion to figure out what file to lint and run them through the relevant
linter and report any errors.

Trying it out
-------------

 1. Install `slint` using `npm install slint`.
 2. Copy/paste the example code below into a `slint.json` in the root of your project.
 3. Run `./node_modules/.bin/slint slint.json`.

If you want to add slint as a git pre-commit hook, fire off the following stanza:

    echo ./node_modules/.bin/slint slint.json > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit

Advanced slinting
-----------------

The linters can be given optional configurations (strings will be read as JSON
files and objects will be passed directly).

It is also important that linters can be run multiple times with different
configurations/different files. (Ex. to allow ES5-stuff in Node.js-code, but
disallow it in front-end code.)

    [
        {
            "tool": "jshint",
            "files": ["./frontend-code/**/*.js", "!3rdparty"],
            "config": "./misc/jshint-frontend.conf"
        },
        {
            "tool": "jshint",
            "files": ["lib/**.js", "test/**.js" ],
            "config": "./misc/jshint-nodejs.conf"
        },
        {
            "tool": "trailing-whitespace",
            "files": ["**", "!node_modules", "!3rdparty"],
        },
        {
            "tool": "json",
            "files": ["**/*.json", "!node_modules", "!3rdparty"],
			"config": {
				"indent": "  ",     // Use two spaces
				"canonical": false  // Don't sort object keys
			}
        }
    ]

Goals
-----

 * Uniform output from all linters (and reporters to format output).
 * Pluggable linting infrastructure.
 * Fast. I/O seem to be the limiting factor, so by being async and work to not
   read files multiple times, it should improve.

Linters
-------

 * Trailing whitespace
 * jshint
 * less (TODO)
 * JSON
   * Configuration: `canonical` (default: `false`) - checks if keys are sorted.
	 `indent` (default: off) will check if the file is indented with the given
	 string.
 * Installed NPM packages vs. package.json (TODO)
 * package.json sanity checks (TODO)
 * HTML (TODO)

See also
--------

 * [nlint](https://github.com/codenothing/Nlint)

License
-------

BSD (3-clause variety)
