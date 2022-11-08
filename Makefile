IMAGE_TAG=huvrdata/evaluate
ROOT=/lib

build:
	docker build . -t ${IMAGE_TAG}

_test:
	docker run ${IMAGE_TAG} node ${ROOT}/test/index.test.js

test: build _test

_dist:
	# docker run --volume ${PWD}/dist:${ROOT}/dist ${IMAGE_TAG} npx webpack
	docker run --volume ${PWD}/dist:${ROOT}/dist ${IMAGE_TAG} npx rollup ${ROOT}/src/index.js --file ${ROOT}/dist/evaluate.js --format umd --name "evaluate"

dist: test _dist

_test_dist:
	docker run -e USE_DIST=1 ${IMAGE_TAG} node ${ROOT}/test/index.test.js

test__dist: dist _test_dist

_release:
	npx np --no-tests  # (tests already run by make)

release: test__dist _release

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: build test dist
