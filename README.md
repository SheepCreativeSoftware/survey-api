# survey-api
simple API to generate and manage a simple survey.  
This project is mainly focused on enhancing knowledge and learnig new things, while working with them.  

The API automatically connects to a SQL Database (MariaDB) and creates necessary tables.
It is designed to run behind an ngnix proxy (which will later provide a frontend).
A user can create a survey, which provides him a creationToken. The creationToken is used to manage a survey and is like some kind of authorization (No extra user registration/login/identification).
Later on a publicToken is used to open a existing survey and answer it.


## API Routes
Defined with: [Swagger UI](https://sheepcreativesoftware.github.io/swagger-survey-api/)

- Commands
	- POST /create-survey => { id }
	- POST /adjust-survey
	- POST /complete-survey => removed after 30 days after completion
	- POST /answer-survey
- Queries
	- GET /open-surveys
	- GET /completed-surveys => results

## Database structure
### Table User
- user_id: int [PK] (AUTO INCREMENTS),
- first_name: VARCHAR(50) REQUIRED,
- last_name: VARCHAR(50) REQUIRED,
- email: VARCHAR(50) REQUIRED UNIQUE,
- password: VARCHAR(50) REQUIRED
- active: BOOLEAN


### Table survey
- survey_id: int [PK] (AUTO INCREMENTS),
- user_id: int REQURED,
- survey_name: TINYTEXT REQUIRED,
- survey_description: TEXT REQUIRED,
- created: DATETIME, (defaults),
- choices_type: TINYTEXT REQUIRED,
- end_date: DATETIME REQUIRED,
- completed: BOOLEAN

### Table options
- survey_id: REFERENCES TO survey(survey_id),
- option_id: VARCHAR(36) UUID,
- option_name: TINYTEXT REQUIRED,
- content: TEXT REQUIRED,

### Table results
- survey_id: REFERENCES TO survey(survey_id),
- result_id: VARCHAR(36) UUID,
- option_selection: JSON REQUIRED (Array of option_id),
- submited: DATETIME (current timestamp of creation)

## Setup
Requires a relational SQL Database (Designed to run on MariaDB min-version: 10.11.x)
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
**DATABASE_CON_TIMEOUT** e.g. time in milliseconds DB stop connection to DB

