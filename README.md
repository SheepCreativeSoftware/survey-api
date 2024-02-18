# survey-api
simple API to generate and manage a simple survey.
The API automatically connects to a SQL Database (MariaDB) and creates necessary tables.
It is designed to run behind an ngnix proxy (which will provide a frontend).
A user can create a survey, which provides him a creationToken. The creationToken is used to manage a survey and is like some kind of authorization (No separate user registration/login).
It uses Double Submit Cookie pattern for csrf protection.
Later on a publicToken is used to open a existing survey and answer it.


## Routes
### Default start routes
- survey/startSession GET
	- returns csrf token (Required for POST)
- survey/openShare GET
	- Requires publicToken
	- Returns sessionId, surveyName: string, surveyDescription:string, creatorName: string, endDate: DateString, optionsArray
	- Failes if IP-Address is known

- survey/createNew POST
	- requires surveyName: string, surveyDescription:string, creatorName: string, endDate: DateString
	- returns a creationToken (Required for creation POSTs)
- survey/removeSurvey POST
	- requires creationToken,
	- returns OK

### Manage Survey (Requires creationToken)
- manage-survey/getOption GET
	- Requires creationToken, optionId: number,
	- returns optionId: number, optionName: string, content: string,
- manage-survey/getAllOptions GET
	- Requires creationToken,
	- returns an array with: optionId: number, optionName: string, content: string,
- manage-survey/getShareLink GET
	- Requires creationToken,
	- returns shareLink with publicToken

- manage-survey/addOption POST
	- Requires creationToken, optionName: string, content: string, 
	- returns optionId:number
- manage-survey/updateOption POST
	- Requires creationToken, optionId: number, optionName: string, content: string, 
	- returns OK
- manage-survey/deleteOption POST
	- Requires creationToken, optionId: number,
	- returns OK


### Answer (Session)
- answer-survey/finishSurvey POST
	- Requires publicToken, sessionId, optionSelection: optionId,
	- Store PseudoSession

### Results
- result-survey/getResults GET
	- Requires creationToken,
	- Returns results for each option

## Database structure
### Table survey
survey_name: string,  
survey_description: string,  
creator_name: string,  
created: DateSting, (defaults)  
end_date: DateString,  
creation_token: Hash,  
public_token: Hash,  
survey_id: id (defaults),  

### Table options
survey_id: id,  
option_id: uuid  
option_name: string,  
content: string,  

### Table sessions
survey_id: id,  
session_id,  
option_selection: optionId,  
ip_address: string,  
submited: DateString (defaults)  

## Setup
### Environment Variables

