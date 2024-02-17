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
