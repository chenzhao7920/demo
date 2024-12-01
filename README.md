# Full_Stack_interview_demo
Full stack app using React, node.js, express, postgreSQL,Redis and Docker

# Getting Started
Follow these steps to run the project locally using Docker or Node.js:

## Run with Docker Compose

In the project directory, you can use docker compose command to create app container:
### ```docker compose up --build```
This will:

Build and start the PostgreSql Database services and Redis Database Service.
## Create Database
inside server folder, use prisma migrations files to migrate prisma db to postgreSQL
### `npx prisma migrate deploy`

## Run Backend
In server folder
### `cd server`
### `npm install`
### `npm run dev`
The backend will be accessible at http://localhost:5000

## Run Frontend
In frontend folder
### `cd frontend`
### `npm install`
### `npm start`
The frontend will be accessible at http://localhost:3000