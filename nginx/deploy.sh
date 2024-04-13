#!/bin/bash

cd ..
docker-compose down
git pull
docker-compose -f docker-compose.production.yml up --build -d
