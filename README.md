slint
=====

Lint-tool for web projects

Place a `slint.json` in your project root with contents roughly like this:

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

Running `slint` will then run the given linters on all the relevant files and
report the collected results.

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
