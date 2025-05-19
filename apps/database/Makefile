build:
	docker build -t aeg-poc-database -f Dockerfile .

run-only:
	docker run --rm --name aeg-poc-database \
		-e POSTGRES_USER=aeg \
		-e POSTGRES_PASSWORD=mysecretpassword \
		-e POSTGRES_MULTIPLE_DATABASES=categories:aeg:mysecretpassword,comments:aeg:mysecretpassword,posts:aeg:mysecretpassword,users:aeg:mysecretpassword \
		-p 5432:5432 \
		-v ./init-multiple-databases.sh:/docker-entrypoint-initdb.d/init-multiple-databases.sh \
      	-v ./postgres_data:/var/lib/postgresql/data \
		aeg-poc-database

run:
	@IMAGE_NAME="aeg-poc-database"; \
	if [ "$$(docker images -q $$IMAGE_NAME 2> /dev/null)" = "" ]; then \
		echo "Image not found, building..."; \
		make build; \
	fi; \
	make run-only
