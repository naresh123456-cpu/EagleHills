//USEUNIT GenericFunctions
//USEUNIT TestMethodExecutor_Web
//==================================================================================================================
// Function Name: InitiateTestRun
// Input Parameters: NIL
// Output Parameters: NIL
// Description:This function reads all testcases and executes test steps 
//==================================================================================================================
function InitiateTestRun()
{
	try
	{
		TestCaseInfo("Testcase Reading Starts here")
		Project.Variables.TestStatus = "Pass"
		if (Project.Variables.AUT == "EH_Web" || Project.Variables.AUT == "EH_CRM" || Project.Variables.AUT == "EH_Mobile")
		{
			ReadTestCases()
		}
		ExecuteTestSteps()
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


//==================================================================================================================
// Function Name: ReadTestCases
// Input Parameters: NIL
// Output Parameters: NIL
// Description:This function is used to read the test cases , corresponding json and call Run Test cases function
//==================================================================================================================
function ReadTestCases()
{
	try
	{
		TestCaseInfo("Reading Testcase")
		Project.Variables.TestStatus = "Pass"
		result = ExecuteQuery(Project.Variables.QAAutomationConnString, "SELECT * FROM [dbo].[SelectTests] where [State]='Active' and MachineName='" + Sys.HostName + "' and AUT='" + Project.Variables.AUT + "'order by selectid", "select")
		if (result.RecordSize != 0)
		{
			while (!result.EOF)
			{
        var Type = result.FieldByName("Type").Value;
				var ExecutionDetails = result.FieldByName("ExecutionDetails").Value;
				if (Type == "TestCase" && Project.Variables.AUT == "EH_Web")
				{
					RunTestCases(ExecutionDetails)
				}
				if (Type == "TestCase" && Project.Variables.AUT == "EH_CRM")
				{
					RunTestCases_CRM(ExecutionDetails)
				}
				if (Type == "TestCase" && Project.Variables.AUT == "EH_Mobile")
				{
					RunTestCases_Mobile(ExecutionDetails)
				}
				if (Type == "Group")
				{
					SelectGroup(ExecutionDetails)
				}        
				result.Next();
			}
		}
		else
		{
			Log.Message("No Records are present for this criteria")
		}
	}
	catch (e)
	{
		Log.Error(e.stack);
		Project.Variables.TestStatus = "Fail"
	}
	finally
	{
		TestCaseCleanUp()
	}
}

//==================================================================================================================
// Function Name: SelectGroup
// Input Parameters: groupName
// Output Parameters: NIL
// Description:This function is used to select group if from group name
//==================================================================================================================
function SelectGroup(groupName)
{
	try
	{
		TestCaseInfo("SelectGroup")
		resultgrpId = ExecuteQuery(Project.Variables.QAAutomationConnString, "select GroupId from [dbo].[TestGroup] where TestGroupName='" + groupName + "' and AUT='" + Project.Variables.AUT + "'", "select")
		if (resultgrpId.RecordSize != 0)
		{
			while (!resultgrpId.EOF)
			{
				var GroupId = resultgrpId.FieldByName("GroupId").Value;
				SelectTestCases_Groups(GroupId)
				resultgrpId.Next();
			}
		}
		else
		{
			Log.Message("No Records are present for this criteria")
		}
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



//==================================================================================================================
// Function Name: SelectTestCases_Groups
// Input Parameters: groupID
// Output Parameters: NIL
// Description:This function is used to select Test ID from corresponding groupId and Run Test cases
//==================================================================================================================
function SelectTestCases_Groups(groupID)
{
	try
	{
		TestCaseInfo("SelectTestCases_Groups")
		resulttestId = ExecuteQuery(Project.Variables.QAAutomationConnString, "select TestId from dbo.TestCaseTestGroupMapping where GroupId=" + groupID + " and AUT='" + Project.Variables.AUT + "'", "select")
		if (resulttestId.RecordSize != 0)
		{
			while (!resulttestId.EOF)
			{
				var TestId = resulttestId.FieldByName("TestId").Value;
				if(Project.Variables.AUT=='EH_Web'){
        RunTestCases(TestId)
        }
        if(Project.Variables.AUT=='EH_CRM'){
          RunTestCases_CRM(TestId)
        }
				resulttestId.Next();
			};
		}
		else
		{
			Log.Message("No Records are present for this criteria")
		}
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

//==================================================================================================================
// Function Name: RunTestCases
// Input Parameters: testID
// Output Parameters: NIL
// Description:This function is used to get the test case details and run accordingly
//==================================================================================================================
function RunTestCases(testID)
{
	try
	{
		TestCaseInfo("Reading TestSteps")
		resultTest = ExecuteQuery(Project.Variables.QAAutomationConnString, "SELECT * FROM [dbo].[TestCase] where TestID=" + testID + " and isActive=1 and AUT='" + Project.Variables.AUT + "'", "select")
		if (resultTest.RecordSize != 0)
		{
			var TestId = resultTest.FieldByName("TestId").Value;
			var TestName = resultTest.FieldByName("TestName").Value;
			var TestCaseFixtureSteps = resultTest.FieldByName("TestCaseFixtureSteps").Value;
			var TestCaseSteps = resultTest.FieldByName("TestCaseSteps").Value;
			var TestCaseClosureSteps = resultTest.FieldByName("TestCaseClosureSteps").Value;
			Project.Variables.testID_Exec = TestId
			Project.Variables.ErrorCount = 0;
			aqTestCase.Begin(TestName)
			ExecuteSingleJson(TestCaseFixtureSteps)
      if (TestCaseSteps.length > 0 && Project.Variables.ErrorCount==0)
      {
			ExecuteSingleJson(TestCaseSteps)
      }
			if (TestCaseClosureSteps.length > 0 && Project.Variables.ErrorCount==0)
			{
				ExecuteSingleJson(TestCaseClosureSteps)
			}
			aqTestCase.End()
      if(Project.Variables.ErrorCount==0){
			ExecuteQuery(Project.Variables.QAAutomationConnString, "update [dbo].[TestCase] set Status='Passed',lastRunAt=getDate() where TestId=" + TestId + "", "update")
			ExecuteQuery(Project.Variables.QAAutomationConnString, "insert into dbo.TestRunHistory values('" + TestName + "','','" + Project.Variables.BuildDetails + "','Passed',getDate(),'" + Project.Variables.PathToReports + "','" + Sys.HostName + "','" + Project.Variables.AUT + "','','','','')", "insert")
		}else{
          ExecuteQuery(Project.Variables.QAAutomationConnString, "update [dbo].[TestCase] set Status='Failed',lastRunAt=getDate() where TestId=" + Project.Variables.testID_Exec + "", "update")
		      ExecuteQuery(Project.Variables.QAAutomationConnString, "insert into dbo.TestRunHistory values('" + TestName + "','','" + Project.Variables.BuildDetails + "','Failed',getDate(),'" + Project.Variables.PathToReports + "','" + Sys.HostName + "','" + Project.Variables.AUT + "','','','','')", "insert")
		
    }
    }
		else
		{
			Log.Message("No Records are present for this criteria")
		}
	}
	catch (e)
	{
    ExecuteQuery(Project.Variables.QAAutomationConnString, "update [dbo].[TestCase] set Status='Failed',lastRunAt=getDate() where TestId=" + Project.Variables.testID_Exec + "", "update")
		 ExecuteQuery(Project.Variables.QAAutomationConnString, "insert into dbo.TestRunHistory values('" + TestName + "','','" + Project.Variables.BuildDetails + "','Failed',getDate(),'" + Project.Variables.PathToReports + "','" + Sys.HostName + "','" + Project.Variables.AUT + "','','','','')", "insert")
		
		Log.Error(e.stack);
		}
	finally
	{

		TestCaseCleanUp()
	}
}

//==================================================================================================================
// Function Name: ExecuteSingleJson
// Input Parameters: jsonObj
// Output Parameters: NIL
// Description:This function is used to Execute single Level Json
//==================================================================================================================
function ExecuteSingleJson(jsonObj)
{
	try
	{
		var jsonData=JSON.parse(jsonObj)
    for(var key in jsonData)
    {
      if(key.length >0 && Project.Variables.ErrorCount==0){
        MethodExecutor(key, jsonData[key])
      }
    }
	}
	catch (e)
	{
		Log.Error(e.stack)
	}
}





//==================================================================================================================
// Function Name: MethodExecutor
// Input Parameters: methodName, data
// Output Parameters: NIL
// Description:This function is used to execute methods. It takes Method Name and data as parameters.
//==================================================================================================================
function MethodExecutor(methodName, data)
{
	try
	{
		if (Project.Variables.AUT == "EH_Web")
		{
			MethodExecutor_Web(methodName, data)
		}
		
	}
	catch (e)
	{
		Log.Error(e.stack);
	}
	finally
	{

	}
}