//USEUNIT DBConnection

function ExecuteQuery( strQuery, strSQLStatement)
{
    try
    {
        Log.Message("Query Details : " + strQuery)
        var qry = ADO.CreateADOQuery();
        qry.ConnectionString = "Driver={PostgreSQL ANSI};Server=qa-automation-dev.cpvhw7w0kbf5.us-east-1.rds.amazonaws.com;Port=5432;Database=QA_Auto_TestComplete;Uid=postgres;Pwd=Testing123!;";
        qry.SQL = strQuery;
        if (aqString.ToUpper(strSQLStatement) == aqString.ToUpper("select"))
        {
            qry.Open();
        }
        else if ((aqString.ToUpper(strSQLStatement) == aqString.ToUpper("insert")) || (aqString.ToUpper(strSQLStatement) == aqString.ToUpper("update")) || (aqString.ToUpper(strSQLStatement) == aqString.ToUpper("commit")) || (aqString.ToUpper(strSQLStatement) == aqString.ToUpper("delete")))
        {
            qry.ExecSQL();
        }
    }
    catch (e)
    {
        Log.Error(e.message);
        //in case of any oracle error we can initialize qry to null
        qry = null
    }
    finally
    {
        return qry;
qry.Close()
    }
}
function test4(){
  var resultdata=ExecuteQuery("select * from automation_properties where AUT='EH_Web'", 'select')
  //Log.Message(resultdata.FieldByName('[key]').Value)
  if (resultdata.RecordSize != 0){
    while (!resultdata.EOF){
      Log.Message(resultdata.FieldByName('value').Value)
      Log.Message(resultdata.FieldByName('AUT').Value)
     // Log.Message(resultdata.FieldByName('[key]').Value)
      resultdata.Next();
    }
  }
}



