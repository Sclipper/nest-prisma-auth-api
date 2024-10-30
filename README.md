# Nest Prisma Auth API

A starter template for building a RESTful API with NestJS, Prisma, and authentication features. This repository is set up to provide essential structures for working with a PostgreSQL database, using Prisma for ORM, and incorporating authentication functionality with NestJS.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A modern database toolkit that simplifies working with databases in a type-safe manner.
- **PostgreSQL**: The primary database for this template, integrated seamlessly with Prisma.
- **Bcrypt**: For hashing and securely storing passwords.
- **PassportJS**: Authentication middleware for handling user authentication flows.

## Getting Started

Follow these steps to clone, set up, and initialize the project for a new repository.

### Initial Setup

1. **Create a new project folder** and navigate into it:

```bash
mkdir {projectName}
cd {projectName}
```

2. Clone this repository

3. Remove the existing origin:

```bash
git remote remove origin
```

4. Set up a new GitHub repository and copy the repository URL provided by GitHub. Then, add it as the origin:

```bash
git remote add origin https://github.com/${nickname}/${projectName}.git
git branch -M master
git push -u origin master
```


## Project Setup

1. Setup Database: 
Here is an example of a docker-compose file for setting up a PostgreSQL database:
```
version: '3.9'

services:
  db:
    image: postgres
    restart: always
    shm_size: 128mb
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: database-name
    volumes:
      - location/you/want/the/database/in:/var/lib/postgresql/data
    ports:
    - "5432:5432"
```

2. Environment Variables:

- Copy the bellow config into the `.env` file and replace the values with your own:

```
DATABASE_URL="postgresql://sclipper:postgres@111.111.111.111:5433/{{database_name}}"

JWT_ACCESS_TOKEN_SECRET=any_random_string
JWT_ACCESS_TOKEN_EXPIRATION_MS=3600000 #1 hour

JWT_REFRESH_TOKEN_SECRET=another_random_string
JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000 #7 days
```

3.  Install Dependencies:

```bash
yarn
```

4. Migrate the database

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
yarn start:dev
```