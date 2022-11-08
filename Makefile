IMAGE_TAG=huvrdata/evaluate

build:
	docker build . -t ${IMAGE_TAG}

test: build
	docker run ${IMAGE_TAG} npm test

dist: build test
	docker run --volume ${PWD}/dist:/lib/dist ${IMAGE_TAG} npx webpack

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: build test dist
