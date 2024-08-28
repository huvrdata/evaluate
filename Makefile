IMAGE_TAG=huvrdata/evaluate
ROOT=/lib

build:
	docker build . -t ${IMAGE_TAG}

# using `_<target>` to allow debugging release steps

_test:
	docker run ${IMAGE_TAG} node --trace-uncaught ${ROOT}/test/index.test.js

test: build _test

_dist:
	docker run --volume ${PWD}/dist:${ROOT}/dist ${IMAGE_TAG} npx esbuild ${ROOT}/src/index.js --outfile=${ROOT}/dist/evaluate.js --bundle --format=esm --global-name="evaluate"

dist: test _dist

_release:
	npx np --no-tests  # (manually run tests with `make` command)

release: dist _release

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: build _test test _dist dist _release release
