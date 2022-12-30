//USEUNIT E_Service
//USEUNIT EH_eServiceWeb_Init

//==================================================================================================================
// Function Name: MethodExecutor_Web
// Input Parameters: methodName, data
// Output Parameters: NIL
// Description:This function is used to execute methods of E-service Web application. It takes Method Name and data as parameters.
//==================================================================================================================

function MethodExecutor_Web(methodName, data){
  try
	{
    switch (methodName)
		{
      case 'LaunchBrowser':
         LaunchBrowser()
        break; 
      case 'HamburgurMenu':
         HamburgurMenu()
        break; 
      case 'ServicerequestEnable':
         ServicerequestEnable()
        break;
      case 'RequestStatusEnable':
         RequestStatusEnable()
        break;
      case 'Property':
         Property(data)
        break; 
      case 'ServiceRequest':
         ServiceRequest(data)
        break; 
      case 'problemcategory':
         problemcategory(data)
        break; 
      case 'AppointmentDate':
         AppointmentDate()
        break;
      case 'Problemdescription':
         Problemdescription(data)
        break;
      case 'RequestStatus':
         RequestStatus()
        break;
      case 'Logout':
        Logout()
        break;
      default:
				Log.Error("Method not yet Implemented." + methodName)
      }
	}
	catch (e)
	{
		Log.Error(e.stack);
	}
}