APPLICATION_NAME=front-next-sass

build:
	docker-compose build

up:
	docker-compose up

up-d:
	docker-compose up -d

exec:
	docker exec -it $(APPLICATION_NAME) sh

delete:
	docker rm -f $(APPLICATION_NAME)

start:
	docker run -it --rm --name $(APPLICATION_NAME) -v ${PWD}:/app -p 3000:3000 $(APPLICATION_NAME) /bin/sh -c "yarn build && npm start"

stop:
	docker-compose down