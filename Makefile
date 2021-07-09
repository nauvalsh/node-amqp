build:
	docker-compose build --no-cache

# docker-compose build --no-cache
	
up:
	docker-compose up -d

down: 
	docker-compose down

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

