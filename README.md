## Option 1: Running the Application with Docker

This project includes a Dockerfile and a docker-compose.yml file for running the application in a Docker container.

### Starting the Docker Container

To build and start the application with Docker, execute the following command:

```bash
docker-compose up -d
```

### Running Tests in Docker

You can run unit tests and end-to-end tests inside the Docker container:

```bash
docker-compose exec nestjs_app yarn test       # Run unit tests
docker-compose exec nestjs_app yarn test:e2e  # Run end-to-end tests
```

## Option 2: Running the Application Locally

This project is a Node.js application built with the NestJS framework. Ensure you have Node.js and Yarn installed on your local machine.

### Requirements

- Node.js (version 20.12.2 or later)
- Yarn (latest version)

### Local Setup

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install project dependencies by running:

```bash
yarn install
```

4. Start the application in development mode:

```bash
yarn start:dev
```

The application will be accessible at `http://localhost:3000`.

### Running Tests Locally

You can run both unit tests and end-to-end tests locally:

```bash
yarn test       # Run unit tests
yarn test:e2e  # Run end-to-end tests
```
