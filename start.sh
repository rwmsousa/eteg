#!/bin/bash

cd front
docker-compose up -d
cd ../back
docker-compose up -d
cd ..