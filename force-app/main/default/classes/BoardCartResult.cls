public with sharing class BoardCartResult {
    // Class for storing and returning a shopping cart query result
    @AuraEnabled
    public Boardstore_Cart__c cartHeader { get; set; }

    @AuraEnabled
    public Boardstore_Cart_Line__c[] cartLines { get; set; }

}
