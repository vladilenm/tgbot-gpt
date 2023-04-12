build: 
	docker build -t tgbot .

run: 
	docker run -d -p 3000:3000 --rm --name tgbot tgbot
