build: 
	docker build -t tgbot .

run: 
	docker run -d -p 3000:3000 --rm --name tgbot tgbot

mongo:
	docker run -d -p 27017:27017 --rm --name mongo mongo