# aeg-poc

Prove-of-concept using Node, Nullstack, GQL and microservices, all in a TypeScript
monorepository.

This is just a small simple blog project with a few microservices, to test the waters of
Nullstack and microservices

## 🧩 Structure

A simple TypeScript monorepo that has a single main package.json (uses NPM workspaces, so
there's one node_modules folder) and a main base tsconfig.json file.

This structure is thought to be simple, using Yarn workspaces, easy on your HD storage (🖕
node_modules) and of course, communicate very well between the files.

No need for multiple text editors nor IDEs open at the same time. Save some of your RAM.

### 📦 Packages

The internal packages are located in the `packages` folder. The packages are:

- `@aeg-poc/common`: Common code shared between the apps and services.
- `@aeg-poc/scripts`: House of all scripts such as build and start:api.
- `@aeg-poc/models`: Postgres models for the database, each one including the GraphQL type.
- `@aeg-poc/sdk`: SDK for the GraphQL API, making it easier to communicate with the services
  through its methods.
- `@aeg-poc/theme`: Tailwind theme for the project, including the colors and fonts.
- `@aeg-poc/ui`: UI components for the project, such as buttons, etc, to ensure consistency
  across the apps, how they look and feel.
- `@aeg-poc/utils`: Utility functions for the project, such as date formatting and string
  manipulation.

### 📱 Apps

The apps are located in the `apps` folder. The apps are:

- `@aeg-poc/api-gateway`: The API gateway for the project, using GraphQL and Apollo Server.
- `@aeg-poc/database`: The database for the project, using Postgres. Ideally, each service
  should have its own database, but for the sake of simplicity, we are using a single
  database for all the services.

### 🧑‍🔧 Services

The services are located in the `services` folder. The services are:

- `@aeg-poc/users-service`: The users service for the project, using GraphQL and Apollo
  Server, consuming the Postgres database.
- `@aeg-poc/posts-service`: The posts service for the project, using GraphQL and Apollo
  Server, consuming the Postgres database.
- `@aeg-poc/comments-service`: The comments service for the project, using GraphQL and
  Apollo Server, consuming the Postgres database.
- `@aeg-poc/categories-service`: The categories service for the project, using GraphQL and
  Apollo Server, consuming the Postgres database.

## Getting Started

### Prerequisites

- Node.js v20.0 or higher
- Yarn
- Docker (for database/deployment)
- Docker Compose (for deployment)

--

### Installation

1. Clone the repository:

```bash
git clone git@github.com:mococa/aeg-poc.git
```

2. Navigate to the project directory:

```bash
cd aeg-poc
```

3. Install dependencies:

```bash
yarn
```

This will install all the dependencies for the project, including the packages, apps,
services... Everything in one `node_modules` folder. Mind that in order to use workspaces,
you need a drive that supports it (this excludes FAT32, for example).

### Development

To start the development server, you can use the following commands:

```bash
yarn start:api # in one terminal
```

or

```bash
yarn build
docker compose up --build
```

#### Building

Notice that first we build the project (bundle each service), and then we run the docker
compose command to start the services. If you check each service Dockerfile, you will see
that we are not running any build command there, we are just copying the bundled files to
the docker image. This accelerates the build process.

## Deployment
