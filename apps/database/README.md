# Database

The Dockerfile is quite simple. It uses the official PostgreSQL 14 image based on Alpine as
the base image.

It's currently being used for all services (I know, not ideal but yeah lol we can change
that later to include it in each service Dockerfile: simple as that).

## Getting started

To build the image, run the following command:

```bash
yarn workspace @aeg-poc/database build
```

Afterwards, everytime you need to run it, you can use the following command:

```bash
yarn workspace @aeg-poc/database start
```
