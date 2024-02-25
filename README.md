# survey-api
simple API to generate and manage a simple survey.  
This project is mainly focused on enhancing knowledge and learnig new things, while working with them.  

The API automatically connects to a SQL Database (MariaDB) and creates necessary tables.
It is designed to run behind an ngnix proxy (which will later provide a frontend).
A user can create a survey, which provides him a creationToken. The creationToken is used to manage a survey and is like some kind of authorization (No extra user registration/login/identification).
Later on a publicToken is used to open a existing survey and answer it.


## API Routes
Defined with: [Swagger UI](https://sheepcreativesoftware.github.io/swagger-survey-api/)

## Database structure
### Table survey
- survey_id: int [PK] (AUTO INCREMENTS),
- survey_name: TINYTEXT REQUIRED,
- survey_description: TEXT REQUIRED,
- creator_name: TINYTEXT REQUIRED,
- created: DATETIME, (defaults),
- choices_type: TINYTEXT REQUIRED,
- end_date: DATETIME REQUIRED,
- creation_token: base64url Hash UNIQUE REQUIRED,
- public_token: base64url Hash UNIQUE REQUIRED,

### Table options
- survey_id: REFERENCES TO survey(survey_id),
- option_id: VARCHAR(36) UUID,
- option_name: TINYTEXT REQUIRED,
- content: TEXT REQUIRED,

### Table sessions
- survey_id: REFERENCES TO survey(survey_id),
- session_id: VARCHAR(36) UUID,
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

