slint
=====

Lint-tool for web projects

(Note: Still doesn't quite work like this, but it's getting there...)

Place a `slint.json` in your project root with contents roughly like this:

    {
        "jshint": {
	        "files": ["./frontend-code", "!3rdparty"],
		    "config": "./misc/jshint-frontend.conf"
	    },
	    "jshint": {
	        "files": ["./lib", "./test"],
		    "config": "./misc/jshint-nodejs.conf"
	    },
	    "trailing-whitespace": {
	        "files": ["."],
	    },
	    "json": {
	        "files": [".", "!node_modules", "!3rdparty"],
	    }
    }

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
 * jshint (TODO)
 * less (TODO)
 * JSON (TODO)
 * Installed NPM packages vs. package.json
 * package.json sanity checks
 * ...

License
-------

BSD (3-clause variety)
