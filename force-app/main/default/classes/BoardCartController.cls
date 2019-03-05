public with sharing class BoardCartController {
    @AuraEnabled
    public static List<Boardstore_Cart__c> getCartHeader(String userId){
        // this method takes the user id and returns either
        // the current open Cart Header record or, if no open carts
        // exist, creates a new one and returns that. 
        List<Boardstore_Cart__c> currentCarts = new List<Boardstore_Cart__c>(
                                            [SELECT Id, Name, Date_Created__c, Cart_Status__c 
                                            FROM Boardstore_Cart__c 
                                            WHERE ownerId =: userId 
                                            AND  Cart_Status__c = 'Open'
                                            LIMIT 1]);
        if(currentCarts.isEmpty()) {
            // create a new cart and return that
            Boardstore_Cart__c singleToCreate = new Boardstore_Cart__c();
            singleToCreate.Date_Created__c = System.Datetime.now();
            singleToCreate.Cart_Status__c = 'Open';
            singleToCreate.ownerId = userId;
            
            // Insert into database
            try {
                Database.SaveResult results = Database.insert(singleToCreate);
            } catch(DmlException e) {
                System.debug('DML Exception thrown: ' + e.getMessage());
            }
            // TODO: add default shipping fields.
            // reset current carts
            currentCarts = [SELECT Id, Name, Date_Created__c, Cart_Status__c 
                            FROM Boardstore_Cart__c 
                            WHERE ownerId =: userId 
                            AND  Cart_Status__c = 'Open'
                            LIMIT 1];
        } 
        return currentCarts;
    }
}
