## Specifications:

1. A user can log in using a username and password.
2. If the username and password are correct, return success and a JWT token.
3. If the username and password do not match, return failure.
4. A user has a maximum of 3 attempts within 5 minutes; otherwise, the user will be locked out for the next five minutes.
5. Once the user is unlocked, they have another three attempts. If these attempts also fail, the user will be locked out indefinitely.
6. If a user is locked out, return failure.

## How to use

```bash
curl  -X POST \
  'http://localhost:3113/v1/auth/login' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "username": "test",
  "password": "test"
}'
```

### Test users:

```
  {
    username: 'test',
    password: 'test',
  },
  {
    username: 'test2',
    password: 'test2',
  },
  {
    username: 'test3',
    password: 'test3',
  },
  {
    username: 'test4',
    password: 'test4',
  },
```

## Option 1: Running the Application with Docker

This project includes a Dockerfile and a docker-compose.yml file for running the application in a Docker container.

### Starting the Docker Container

To build and start the application with Docker, execute the following command:

```bash
docker-compose --env-file env/.env up -d --build
```

The application will be accessible at `http://localhost:3113`.

### Running Tests in Docker

1. Run unit tests:

```bash
docker-compose exec --env-file env/.env nestjs_app_main yarn test
```

2. Run integration tests:

```bash
docker-compose --env-file env/.test.env -f docker-compose.test.yml up nestjs_app_test --build
```

## Option 2: Running the Application Locally

This project is a Node.js application built with the NestJS framework. Ensure you have Node.js and Yarn installed on your local machine.

### Requirements

- Node.js (version 20.12.2 or later)
- Yarn (latest version)

### Local Setup

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Create `.env` file

```bash
cp env/.env.example env/.env
```

4. Install project dependencies by running:

```bash
yarn install
```

5. Start the containerized database:

```bash
docker-compose --env-file env/.env up mongodb -d
```

6. Start the application in development mode:

```bash
yarn start:dev
```

The application will be accessible at `http://localhost:3113`.

### Running Tests Locally

1. Start the containerized test database:

```bash
docker-compose --env-file env/.test.env -f docker-compose.test.yml up mongodb_test -d
```

2. Run unit tests:

```bash
yarn test
```

3. Run integration tests:

```bash
docker-compose --env-file env/.test.env -f docker-compose.test.yml up mongodb_test -d
yarn test:e2e
```
