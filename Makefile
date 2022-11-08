IMAGE_TAG=huvrdata/evaluate
ROOT=/lib

build:
	docker build . -t ${IMAGE_TAG}

test: build
	docker run ${IMAGE_TAG} node ${ROOT}/test/index.test.js

dist: test
	docker run --volume ${PWD}/dist:${ROOT}/dist ${IMAGE_TAG} npx webpack

release:
	npx np

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: build test dist
