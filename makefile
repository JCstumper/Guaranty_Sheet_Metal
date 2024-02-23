.PHONY: all start_docker start_api start_frontend

all: start_docker start_api start_frontend

start_docker:
	docker-compose -f "/Users/Jacob Carney/Documents/Guaranty_Sheet_Metal/docker-compose.yml" up -d

start_api:
	cd "/Users/Jacob Carney/Documents/Guaranty_Sheet_Metal/api" && start /B npm start

start_frontend:
	cd "/Users/Jacob Carney/Documents/Guaranty_Sheet_Metal/FrontEnd/guarantymetalui" && start /B npm start
