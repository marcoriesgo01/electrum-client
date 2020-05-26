# Electrum

### Heroku Hosted Electrum App Link:
https://chronos-app-client.herokuapp.com/

### Heroku Hosted Electrum API:
https://chronos-app-api.herokuapp.com/

### Link to Backend Github Repository:
https://github.com/marcoriesgo01/electrum-api

Electrum is an all-in-one personal finance application for users to link their bank accounts so that they can analyze all of their financial data. Electrum users are able to link and analyze their bank accounts, create and optimize monthly budgets, review monthly bills, and track their investments in real-time. 

## Technologies Used
* HTML 
* CSS 
* React 
* React Router
* React Materialize
* Node.js
* MongoDB
* Express
* Redux - Used for state management on banking and authorization
* Axios - Used for connecting to the API for authorization and banking.
* Fetch - Used for API communication for user information
* JWT Authorization
* Passport
* Mongoose
* Plaid API - Used for connecting user bank accounts to Electrum
* Moment.js - Used for expirations and bank transaction dates
* Chart.js - Used to analyze the user's information
* IEX Cloud API - Used to analyze user's investments and their current value
* Validate - Used to verify that useer information is valid.


### Problem: 
There is currently no single app for users to organize all of their personal finance users need to use multiple applications with different information, which is time-consuming and sometimes confusing.

### General App Idea/Purpose: 
An app that allows users to securely organize all of their personal finances including budgeting, expenses, recurring bills, and investments in one single application.

### Who Would Use It: 
People in the United States with financial assets in need of organization. Users who do not want too have their financial information distributed among different applications.

## Approach taken:
* Models: 
    * Bills
    * Budgets
    * Expenses
    * Investments
    * Plaid
    * Users
* Relationships: Each of the models above is related to a specific user in order for authorization to work efficiently.

### Installation Instructions
yarn install

### Trello User Stories:
[User Stories - Electrum](https://trello.com/b/60ZlDlbf/electrum-stories)

### Electrum Wireframes: 
![Wireframe 1](https://github.com/marcoriesgo01/electrum-client/blob/master/src/img/wireframe1.png?raw=true)

![Wireframe 2](https://github.com/marcoriesgo01/electrum-client/blob/master/src/img/wireframe2.png?raw=true)

![Wireframe 3](https://github.com/marcoriesgo01/electrum-client/blob/master/src/img/wireframe3.png?raw=true)