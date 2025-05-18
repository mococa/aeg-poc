build:
	docker build -t aeg-poc-database -f Dockerfile .

run-only:
	docker run --rm --name aeg-poc-database \
		-e POSTGRES_USER=aeg-poc \
		-e POSTGRES_PASSWORD=mysecretpassword \
		-e POSTGRES_DB=aeg-poc \
		-p 5432:5432 \
		aeg-poc-database

run:
	@IMAGE_NAME="aeg-poc-database"; \
	if [ "$$(docker images -q $$IMAGE_NAME 2> /dev/null)" = "" ]; then \
		echo "Image not found, building..."; \
		make build; \
	fi; \
	make run-only
