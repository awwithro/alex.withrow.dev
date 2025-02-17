.PHONY: build
build: install-deps
	npm run build && docker build -t alex.withrow.dev .

.PHONY: install-deps
install-deps:
	npm install

.PHONY: deploy
deploy: build
	docker save alex.withrow.dev:latest | gzip | ssh makemea "cat | gunzip |docker load && sudo service alex.withrow.dev restart"