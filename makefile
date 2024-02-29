SHELL := /bin/bash
.PHONY: all start_docker start_api start_frontend

all: start_docker start_api start_frontend

start_docker:
	docker-compose -f "./docker-compose.yml" up -d

start_api:
	cd "./api" && start npm start

start_frontend:
	cd "./FrontEnd/guarantymetalui" && start npm start


#made the makefile general so anyone can use it - WK