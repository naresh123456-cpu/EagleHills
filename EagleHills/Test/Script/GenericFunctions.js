//USEUNIT DBConnection
//USEUNIT GlobalVariables

//==================================================================================================================
// Function Name: InitilizeProjectVariables
// Input Parameters: NIL
// Output Parameters: NIL
// Description:This function is used to Initilize Project Variables
//==================================================================================================================
function InitilizeProjectVariables()
{ //Test
	try
	{
		if (!Project.Variables.VariableExists("TestStatus"))
		{
			Project.Variables.AddVariable("TestStatus", "String")
		}
		if (!Project.Variables.VariableExists("testID_Exec"))
		{
			Project.Variables.AddVariable("testID_Exec", "String")
		}
		if (!Project.Variables.VariableExists("ErrorCount"))
		{
			Project.Variables.AddVariable("ErrorCount", "Integer")
		}
		if (!Project.Variables.VariableExists("testCaseErrorMap"))
		{
			Project.Variables.AddVariable("testCaseErrorMap", "Object")
		}
		if (!Project.Variables.VariableExists("testCaseMap"))
		{
			Project.Variables.AddVariable("testCaseMap", "Object")
		}
		if (!Project.Variables.VariableExists("testDataUsed"))
		{
			Project.Variables.AddVariable("testDataUsed", "String")
		}
		if (!Project.Variables.VariableExists("testDataMap"))
		{
			Project.Variables.AddVariable("testDataMap", "Object")
		}
		if (!Project.Variables.VariableExists("Gen_Wait"))
		{
			Project.Variables.AddVariable("Gen_Wait", "Integer")
		}
		if (!Project.Variables.VariableExists("testScenario"))
		{
			Project.Variables.AddVariable("testScenario", "String")
		}
    if (!Project.Variables.VariableExists("GroupName"))
		{
			Project.Variables.AddVariable("GroupName", "String")
		}
 
    Project.Variables.GroupName = "";
		Project.Variables.testCaseMap = new Map()
		Project.Variables.testCaseErrorMap = new Map()
		Project.Variables.testID_Exec = "";
		Project.Variables.TestStatus = "";
		Project.Variables.ErrorCount = 0;
		Project.Variables.testDataUsed = "";
		Project.Variables.testDataMap = new Map()
		Project.Variables.testScenario = "";
		Project.Variables.Gen_Wait = 500;
    
		var resultSet = ExecuteQuery(QAAutomationConnString, "select * from AutomationProperties where MachineName='" + Sys.HostName + "'", "select")
		if (resultSet.RecordSize != 0)
		{
			while (!resultSet.EOF)
			{
				var Key = resultSet.FieldByName("Key").Value;
				if (!Project.Variables.VariableExists(Key))
				{
					Project.Variables.AddVariable(Key, "String")
				}
				else
				{
					Project.Variables[Key] = ""
				}
				Project.Variables[Key] = resultSet.FieldByName("Value").Value;
				resultSet.Next();
			}
		}
		var commonSet = ExecuteQuery(QAAutomationConnString, "select * from AutomationProperties where MachineName =''", "select")
		if (commonSet.RecordSize != 0)
		{
			while (!commonSet.EOF)
			{
				var Key = commonSet.FieldByName("Key").Value;
				if (Key == "QAAutomationConnString")
				{
					if (!Project.Variables.VariableExists(Key))
					{
						Project.Variables.AddVariable(Key, "String")
					}
					else
					{
						Project.Variables[Key] = ""
					}
          Project.Variables[Key] = commonSet.FieldByName("Value").Value;
					
				}
				commonSet.Next();
			}
		}
	}
	catch (e)
	{
		Log.Error(e.stack);
	}
}



//==================================================================================================================
// Function Name: GeneralEvents_OnLogError
// Input Parameters: Sender, LogParams
// Output Parameters: NIL
// Description:This function is used to log an error if respective event is not displayed
//==================================================================================================================

function GeneralEvents_OnLogError(Sender, LogParams)
{
	try
	{
		if (Project.Variables.AUT == "EH_Web")
		{
      Project.Variables.ErrorCount++
		}
	}
	catch (e)
	{
		Log.Error(e.stack);
	}
}

//==================================================================================================================
// Function Name: TestCaseInfo
// Input Parameters: testCaseDescription
// Output Parameters: NIL
// Description:This will be used to get the test case description, what test case is performing
//==================================================================================================================
function TestCaseInfo(testCaseDescription)
{
	Log.AppendFolder(testCaseDescription)
	Indicator.PushText(testCaseDescription)
}


//==================================================================================================================
// Function Name: TestCaseCleanUp
// Input Parameters: NIL
// Output Parameters: NIL
// Description:This function is used to pop the test case info after running successfully.
//==================================================================================================================
function TestCaseCleanUp()
{
	Log.PopLogFolder()
	Indicator.PopText()
}


//==================================================================================================================
// Function Name: GenerateHtmlReport
// Input Parameters: NIL
// Output Parameters: NIL
// Description:This function is used to generate HTML report.
//==================================================================================================================
function GenerateHtmlReport()
{
	try
	{
		TestCaseInfo("Generating HTML Report")
		Project.Variables.PathToReports = Project.Path + "TestReports\\"+Project.Variables.GroupName+"_SmokeTestReport" + new Date().getTime()
		var line = ""
		var updatedText = ""
		durationCount = 0
		Log.Message("Total Time took for execution" + Math.ceil((((aqPerformance.Value("DefaultCounter")) / 60000) * 60)))
		Log.SaveResultsAs(Project.Variables.PathToReports, lsHTML);
	}
	catch (e)
	{
		Log.Error(e.stack);
	}
	finally
	{
		TestCaseCleanUp()
	}
}