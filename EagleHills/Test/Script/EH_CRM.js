
//USEUNIT GenericFunctions
function OpenWebAppliaction({BrowserName='Chrome'})
  {
    if(Sys.WaitBrowser("*").Exists){
      Sys.Browser().Terminate()
      }
       
 switch (BrowserName)
        {
      case 'Chrome':
      Browsers.Item(btChrome).Navigate(Project.Variables.url);
      Aliases.browser.signInPage.emailinputSomeoneExampleCom.WaitProperty("Exists",true,20000)
      break; 
      case 'Firefox':
      Browsers.Item(btFirefox).Navigate(Project.Variables.url);
      Aliases.browser.signInPage.emailinputSomeoneExampleCom.WaitProperty("Exists",true,20000)
      break; 
      default:Log.Error("choose the correct  browser");
    }
    }
 function LoginPage(){
    Aliases.browser.signInPage.emailinputSomeoneExampleCom.SetText(Project.Variables.Email)
    Aliases.browser.signInPage.submitbuttonNext.Click()
    Aliases.browser.signInPage.passwordboxPasswd.WaitProperty("Exists",true,20000)
    Aliases.browser.signInPage.passwordboxPasswd.SetText(Project.Variables.Password)
    Aliases.browser.signInPage.submitbuttonSignIn.Click()
    Aliases.browser.pageSignInToYourAccount.panelStaySignedIn.WaitProperty("Exists",true,20000)
    Aliases.browser.pageSignInToYourAccount.checkboxDonTShowThisAgain.Click()
    Aliases.browser.pageSignInToYourAccount.submitbuttonDoThisToReduceTheNum.Click()
    Aliases.browser.pageHosDashboard.textnodeHosDashboard.panelHosDashboard.WaitProperty("Exists",true,20000)
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeHosDashboard.panelHosDashboard, "Exists", cmpEqual, true);  
  }

  function Logout()
  {
    Aliases.browser.pageHosDashboard.buttonAccountManagerForMobileser.Click()
    Aliases.browser.pageHosDashboard.buttonSignOutOfThisAccount.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.buttonSignOutOfThisAccount.Click()
  }

  function Leads()
  {
    //TC_02
    Aliases.browser.pageHosDashboard.textnodeNavigateDynamics365.textnodeSales.textnodeLeads.Click()
    Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonMyOpenLeads.WaitProperty("Exists",true,20000)
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonMyOpenLeads, "Exists", cmpEqual, true);
    Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonMyOpenLeads.Click()
    Aliases.browser.pageHosDashboard.textnodeMyViews.WaitProperty("Exists",true,20000)
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeMyViews,"Exists", cmpEqual, true);
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeSystemViews,"Exists", cmpEqual, true);
    Aliases.browser.pageHosDashboard.buttonLeadAssignedToQualified.click()
    Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonLeadAssignedToQualified2.WaitProperty("Exists",true,20000)
    if(Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonLeadAssignedToQualified2.Exists){
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonLeadAssignedToQualified2, "contentText", cmpEqual, "Lead Assigned to Qualified\nOpen popup to change view.\n");
  }else{
    Log.Error("Page not yet loaded increase the loading time")
  }

  Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonLeadAssignedToQualified2.click()
  Aliases.browser.pageHosDashboard.buttonMarketResearchView.WaitProperty("Exists",true,20000)
  if(Aliases.browser.pageHosDashboard.buttonMarketResearchView.Exists){
    Aliases.browser.pageHosDashboard.buttonMarketResearchView.Click()
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeHosDashboard.buttonMarketResearchView3, "contentText", cmpEqual, "Market Research View\nOpen popup to change view.\n");
  }else{
    Log.Error("Page not yet loaded increase the loading time")
  }

  }
  function NewLeads(){
    //TC_03
    Aliases.browser.pageHosDashboard.textnodeNavigateDynamics365.textnodeSales.textnodeLeads.panelLeads.Click()
    Aliases.browser.pageHosDashboard.textnodeCommands.buttonPressEnterToOpenFlyout.Click()
    Delay(10000)
    Aliases.browser.pageHosDashboard.textnodeBusinessProcessFlow.textnodeNewLead.panelNewLead.WaitProperty("Exists",true,20000)
    aqObject.CheckProperty(Aliases.browser.pageHosDashboard.textnodeBusinessProcessFlow.textnodeNewLead.panelNewLead, "Exists", cmpEqual, true);
    Aliases.browser.pageHosDashboard.textnodeEagleHillsPropertyAdvise.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.textnodeEagleHillsPropertyAdvise.Click()
    if(Aliases.browser.pageHosDashboard.textnodeSelectAView.textnodeEagleHillsPropertyAdvise3.textnodeEagleHillsPropertyAdvise4.Exists){
    Aliases.browser.pageHosDashboard.textnodeSelectAView.textnodeEagleHillsPropertyAdvise3.textnodeEagleHillsPropertyAdvise4.Click();
    }else{
      Log.Error("Eagle Hills Property Advise form not present")
    }
    Aliases.browser.pageHosDashboard.sectionDialogcontainer13Popupcon.textnodeUnsavedChanges.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionDialogcontainer13Popupcon.buttonSaveAndContinue.Click()
    Aliases.browser.pageHosDashboard.sectionContact.selectLeadTypeRequiredFieldsMust.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.selectLeadTypeRequiredFieldsMust.ClickItem(1)
    Aliases.browser.pageHosDashboard.sectionContact.selectCustomerType.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.selectCustomerType.ClickItem(1)
    Aliases.browser.pageHosDashboard.textnodeCommands.buttonSaveThisLead.Click()
    
    Aliases.browser.pageHosDashboard.sectionContact.textboxCountryOfResidenceRequire.SetText("india")
    Delay(5000)
    Aliases.browser.pageHosDashboard.sectionContact.textboxCountryOfResidenceRequire.Keys("[Down][Enter]")
    Aliases.browser.pageHosDashboard.sectionContact.textboxCountryCodeMobilePhone.WaitProperty("Exists",true,20000)
    //Aliases.browser.pageHosDashboard.sectionContact.textboxCountryCodeMobilePhone.SetText("91")
    Aliases.browser.pageHosDashboard.sectionContact.textboxMobilePhoneRequiredFields.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.textboxMobilePhoneRequiredFields.SetText("9603107208")
    Aliases.browser.pageHosDashboard.sectionContact.textboxEmailRequiredFieldsMustBe.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.textboxEmailRequiredFieldsMustBe.SetText("test@gmail.com")
    Aliases.browser.pageHosDashboard.sectionContact.textboxInterestedInRequiredField.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.textboxInterestedInRequiredField.SetText("jordan")
    Delay(5000)
    Aliases.browser.pageHosDashboard.sectionContact.textboxInterestedInRequiredField.Keys("[Down][Enter]")
    Aliases.browser.pageHosDashboard.sectionContact.textboxFirstNameRequiredFieldsMu.SetText("Motivity")
    Aliases.browser.pageHosDashboard.sectionContact.textboxFirstNameRequiredFieldsMu.WaitProperty("Exists",true,20000)
    Aliases.browser.pageHosDashboard.sectionContact.selectLeadChannelRequiredFields.ClickItem(1)
    Aliases.browser.pageHosDashboard.sectionContact.selectLeadSourceRequiredFields.ClickItem(1)
    Aliases.browser.pageHosDashboard.textnodeCommands.buttonSaveThisLead.Click()
    Delay(30000)
    
  }
