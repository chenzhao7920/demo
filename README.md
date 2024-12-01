# Full_Stack_interview_demo
Full stack app using React, node.js, express, postgreSQL,Redis and Docker

# Getting Started
Follow these steps to run the project locally using Docker and VScode:

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


## Reflection
### Database design
For the Database design, I found there is no unique key in any fields, but there are many repetity data entry for city, county, countrym and timezones, so I created seperate tables for those fields, it will make the database tables more scalable in the future,

### Backend API design
For the backend API design, one of the APIs is used to batch upload CSV files to migrate data from a CSV source. Since the CSV file contains thousands of lines of data, each representing a location, I create entries in multiple tables for each location. To ensure data consistency, I use Prisma transactions to protect the integrity of the data. However, when a high volume of transactions calls the database simultaneously, data lock issues can occur, causing the API to fail. To address this, I used the Node.js package BullMQ along with Redis to create a queued worker process running on Redis. This approach offloads the batch creation process to a separate environment and handles them one by one, and also has the ability to add error handling and retry logic to catch a failed creation job and create it again. Additionally, locations will be added to the database in the order in the csv file for easy proofreading.

For the second API, to obtain the address confidence score, I used a two-layer algorithm. The first layer calculates a latitude and longitude score for all addresses in the system based on the customer's input latitude and longitude, using a scale from 0.1 to 1. Then, the input address is analyzed to check whether it exists in potential columns like street, city, or county, and the first layer data is generated. After that, in the second layer, a more refined calculation is performed. If the input address keywords exactly match the database keyword set, each matching character receives a score of 0.1. So in this way, make the search result more reliable.

### Front end UI design
For the front-end page design, I used the dashboard template provided by the Mui library to enhance the comfort of the page and save development time.
In the search page design, I wrap all the input fields into an invisible form, which helps me manage the page state more easily.
Additionally, considering the user experience, I added URL decoration. After each search, the URL is updated based on the search field and its value, so users can see the keywords and values from their previous search.
For the upload function, I added stackbar, let users know if the csv file is success uploaded or not able to process.

### Github URL:
https://github.com/chenzhao7920/geolocations_search