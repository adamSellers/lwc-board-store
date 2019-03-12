trigger BoardstoreCartTrigger on Boardstore_Cart__c (before insert) {
  // Before insert, update the User_Tax_Rate__c field with the tax
  // rate found from the Tax_Rate__mdt tax rates type. 

  if (Trigger.isBefore) {
    String localeString = UserInfo.getLocale();
    Double localTaxRate;
    
    // get tax rate from custom metadata types
    try {
      localTaxRate = [SELECT Tax_Rate__c FROM Tax_Rate__mdt WHERE DeveloperName =: localeString LIMIT 1].Tax_Rate__c;
    } catch (QueryException e) {
      // in the exception just set the default
      localTaxRate = 10;
    }
    for (Boardstore_Cart__c c : Trigger.New) {
      c.User_Tax_Rate__c = localTaxRate;
    }
  }
}