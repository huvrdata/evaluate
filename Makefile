IMAGE_TAG=huvrdata/evaluate
ROOT=/lib

build:
	docker build . -t ${IMAGE_TAG}

# using `_<target>` to allow debugging release steps

_test:
	docker run ${IMAGE_TAG} node --trace-uncaught ${ROOT}/test/index.test.js

test: build _test

_dist:
	docker run --volume ${PWD}/dist:${ROOT}/dist ${IMAGE_TAG} npx rollup ${ROOT}/src/index.js --file ${ROOT}/dist/evaluate.js --format cjs --name "evaluate"

dist: test _dist

test_use_dist:
	docker run -e USE_DIST=1 ${IMAGE_TAG}  node --trace-uncaught ${ROOT}/test/index.test.js

_release:
	npx np --no-tests  # (manually run tests with `make` command)

release: dist _release

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: build _test test _dist dist _release release
