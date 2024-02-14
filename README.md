# survey-api
simple API to generate and manage a single survey


## Routes
- survey/createNew GET
	- requires surveyName: string, creatorName: string, endDate:DateString
	- returns 200 and a creationToken
- survey/openShare GET
	- Requires publicToken
	- Returns 200 and sessionId, surveyName: string, creatorName: string, optionsArray
	- Failes if IP-Address is known

### Manage Survey
- manage-survey/addOption POST
	- Requires creationToken, optionName: string, content: string, 
	- returns 200 and optionId:uuid if added otherwise failed
- manage-survey/updateOption POST
	- Requires creationToken, optionId: string, optionName: string, content: string, 
	- returns 200 if updated otherwise failed
- manage-survey/deleteOption POST
	- Requires creationToken, optionId: string,
	- returns 200 if removed otherwise failed
- manage-survey/getOption GET
	- Requires creationToken, optionId: string,
	- returns 200 and optionId: string, optionName: string, content: string,
- manage-survey/getAllOptions GET
	- Requires creationToken,
	- returns 200 and and array with: optionId: string, optionName: string, content: string,
- manage-survey/getShareLink GET
	- Requires creationToken,
	- returns 200 and link with publicToken

### Answer (Session)
- answer-survey/finishSurvey POST
	- Requires publicToken, sessionId, optionSelection: optionId,
	- Store IP-Address

### Results
- result-survey/getResults GET
	- Requires creationToken,
	- Returns results for each option

## Database structure
# Table survey
survey_name: string,  
creator_name: string,  
created: DateSting, (defaults)  
endDate: DateString,  
creation_token: Hash,  
public_token: Hash  

# Table options
creation_token,  
option_id: uuid
option_name: string,  
content: string,  

# Table sessions
public_token,  
session_id,  
option_selection: optionId,  
ip_address: string,  
submited: DateString (defaults)  
