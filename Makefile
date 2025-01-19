include .env
IMAGE_NAME=$(DOCKER_IMAGE_NAME)

build:
	docker build -t $(IMAGE_NAME) . --no-cache

up:
	@mkdir -p pgdata
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f app

restart:
	@mkdir -p pgdata
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	docker-compose logs -f app

start:
	yarn start

start-dev:
	yarn start:dev

start-prod:
	yarn start:prod

migration-generate:
	yarn migration:generate $(name)

migration-run:
	yarn migration:run

migration-revert:
	yarn migration:revert

test:
	yarn test

test-watch:
	yarn test:watch

test-e2e:
	yarn test:e2e

lint:
	yarn lint

format:
	yarn format