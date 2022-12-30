
//USEUNIT GenericFunctions
function RunApplication()
{ 
   aqPerformance.Start("DefaultCounter")
  InitilizeProjectVariables() 
  if(Project.Variables.AUT=="EH_CRM")
  {
    EH_Main()
  }
}

