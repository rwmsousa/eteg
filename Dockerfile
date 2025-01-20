FROM alpine:latest

RUN apk add --no-cache docker docker-compose

COPY . /app

WORKDIR /app
