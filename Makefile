build: 
	docker build -t tgbot .

run: 
	docker run -d -p 3000:3000 -e NODE_ENV=production --rm --name tgbot tgbot

stop:
	docker stop tgbot

run-dev:
	docker run -d -p 3000:3000 -e NODE_ENV=development --name tgbot tgbot

mongo:
	docker run -d -p 27017:27017 --rm --name mongo mongo