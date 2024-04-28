# Samstock
A Node.js website project for the course ITCS212 - Web Programming for managing products, users, and administrators in a SamStock.

## Prerequisites:
Before running the application, make sure you have the following softwares installed on your system:
- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/ (or any other compatible database)

## Installation:
1. Download the project folder from the respository (You can use git clone).

2. Navigate to the project directory:
   cd SamStock

3. Install dependencies:
   cd frontend
   npm i	
   cd webservice
   npm i
   
   NOTE: There are two sub-directories which are different projects: frontend webserver and webservice. Make sure you install dependencies in both projects.

4. Set up the database:
   - Create a MySQL database for the application.
   - Import the database schema from samstock/samstock.sql

5. Configure database connection:
   - Update the database configuration in webservice/.env with your MySQL database credentials.
   Note: Ensure that the MySQL user configured in the database connection has appropriate privileges to perform database operations. 
   If necessary, you may need to adjust the user's privileges to include permissions for creating, reading, updating, and deleting data in the application's database.

## Running the Application:
Once the installation is complete and the database is set up, you can run the application with the following command:
   cd webservice
   npm start
   cd frontend
   npm start

This will start the servers, and you should see a message indicating that the servers are running on specific ports (e.g., Listening on port 8080).

## Accessing the Application:
You can access the application through the following URL:
   http://localhost:3030/

Replace 3030 with the port number specified in the console if it's different.

## Endpoints:
The application exposes the following endpoints:

- GET /: Homepage
- GET /products/:id: detail page
- GET /search: search page
- GET /sneakers, /sports, /dressed, /sandals: each category page
- GET /login: login page
- GET /team-page: team page
- GET /account-management: account management page
- GET /product-management: product management page
- GET *: Not Round
- GET /products: return all products
- GET /products/:id: get the product by id
- POST /products: insert product
- PUT /products/:id: update product by id
- DELETE /products/:id: delete product by id
- GET /product-items/:id: get size of each product
- GET /category-images/:id: get branner of each category
- GET /search: search the product by query
- GET /categories: get all the categories
- GET /brands: get all the brands
- GET /sizes: get all the sizes
- GET /accounts/:id: get all the account by id
- GET /accounts: insert account
- GET /accounts/:id: update the account by id
- DELETE /accounts/:id: delete the account by id
- POST /authenticate: check the page that is only admin can enter
- POST /login: login
- GET *: Not found

IMPORTANT: Some endpoints require authentication, and requests are forwarded to corresponding API endpoints for processing.
IMPORTANT: Some endpoints require authentication, and requests are forwarded to corresponding API endpoints for processing.
IMPORTANT: Some endpoints require authentication, and requests are forwarded to corresponding API endpoints for processing.

Refer to the source code or report for more details on how to interact with these endpoints.

NOTE: Credentials for admin authentication are in the database Admin table: login_username, login_password
QUICK ADMIN ACCESS:
   username: super
   password: 1