.PHONY: all pre-commit test lint

all: lint test

git-pre-commit: lint test

test:
	@./node_modules/.bin/mocha

lint:
	@./bin/slint slint.json

git-hook:
	echo make git-pre-commit > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
