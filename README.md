# survey-api
simple API to generate and manage a single survey


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

### Manage Survey
- manage-survey/getOption GET
	- Requires creationToken, optionId: number,
	- returns 200 and optionId: number, optionName: string, content: string,
- manage-survey/getAllOptions GET
	- Requires creationToken,
	- returns 200 and and array with: optionId: number, optionName: string, content: string,
- manage-survey/getShareLink GET
	- Requires creationToken,
	- returns 200 and link with publicToken

- manage-survey/addOption POST
	- Requires creationToken, optionName: string, content: string, 
	- returns 200 and optionId:number if added otherwise failed
- manage-survey/updateOption POST
	- Requires creationToken, optionId: number, optionName: string, content: string, 
	- returns 200 if updated otherwise failed
- manage-survey/deleteOption POST
	- Requires creationToken, optionId: number,
	- returns 200 if removed otherwise failed


### Answer (Session)
- answer-survey/finishSurvey POST
	- Requires publicToken, sessionId, optionSelection: optionId,
	- Store IP-Address

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
