build:
	docker build -t aeg-poc-database -f Dockerfile .

run:
	docker run --rm --name aeg-poc-database \
		-e POSTGRES_USER=aeg-poc \
		-e POSTGRES_PASSWORD=mysecretpassword \
		-e POSTGRES_DB=aeg-poc \
		-p 5432:5432 \
		aeg-poc-database
