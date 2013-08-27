slint
=====

Lint-tool for web projects

(Note: Still doesn't quite work like this, but it's getting there...)

Place a `slint.json` in your project root with contents roughly like this:

    [
        {
            "tool": "jshint",
            "files": ["./frontend-code", "!3rdparty"],
            "config": "./misc/jshint-frontend.conf"
        },
        {
            "tool": "jshint",
            "files": ["./lib", "./test"],
            "config": "./misc/jshint-nodejs.conf"
        },
        {
            "tool": "trailing-whitespace",
            "files": ["."],
        },
        {
            "tool": "json",
            "files": [".", "!node_modules", "!3rdparty"],
			"config": {
				"indent": "  ",     // Force this indent
				"canonical": false  // Sort object keys?
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

License
-------

BSD (3-clause variety)
