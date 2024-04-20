# survey-api
simple API to generate and manage a survey.  
This project is mainly focused on enhancing knowledge and learnig new things, while working with them.  

The API follows the CQRS Pattern with Commands and Queries instead of simple REST API.
A User is able to register an account at the server.
With this account the user can authenticate which will provide him a JWT which can be used to authorize with Bearer Token on creational routes.  
The user can than view and manage surveys.  

After editing of a survey is completed the user can complete the survey, which opens the survey for answering (It can no longer be edited).  
The user can create answerer tokens, to share with people that should answer the survey.  
Each answerer token can only be used ones for answering.

## API Routes
View Specs with: [Swagger UI](https://survey.sheepcs.de/swagger-ui.html)

## Setup
Requires node.js (min-version 20.0.0) a relational SQL Database (Designed to run on MariaDB min-version: 10.11.x)

**Install**  
This will install all needed dependencies and build the app
```bash
npm i
```

**Start**  
It requires enviroment variables or an .env file to run.
```bash
npm run start
# OR
node node --env-file=.env dist/app.js
```

### Environment Variables

#### General
**NODE_ENV** e.g. development | production  
**HOST** e.g. example.com  
**URL** e.g. https://example.com  
**PORT** e.g. 3000  

#### Session
**SESSION_SECRET** e.g. supersecretpassword  

#### MariaDB Database
**DATABASE_HOST**=localhost  
**DATABASE_PORT**=3306  
**DATABASE_USER**=root  
**DATABASE_PASSWORD** e.g. supersecretpassword  
**DATABASE_NAME** e.g. database0815  
**DATABASE_CON_TIMEOUT** e.g. time in seconds DB stop connection to DB (optional)

