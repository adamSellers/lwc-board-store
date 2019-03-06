public with sharing class BoardCartController {
    @AuraEnabled
    public static BoardCartResult getCartHeader(String userId){
        // this method takes the user id and returns either
        // the current open Cart Header record or, if no open carts
        // exist, creates a new one and returns that. 
        List<Boardstore_Cart__c> currentCarts = new List<Boardstore_Cart__c>(
                                            [SELECT Id, Name, Date_Created__c, Cart_Status__c, Cart_Subtotal__c, Total_Items__c,
                                                    Shipping_Street__c, Shipping_City__c, Shipping_Post_Code_Zip__c, Shipping_Country__c,
                                                    Shipping_Details_Confirmed__c,  Tax__c, Cart_Total__c
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
            currentCarts = [SELECT Id, Name, Date_Created__c, Cart_Status__c, Cart_Subtotal__c, Total_Items__c,
                                    Shipping_Street__c, Shipping_City__c, Shipping_Post_Code_Zip__c, Shipping_Country__c,
                                    Shipping_Details_Confirmed__c  
                            FROM Boardstore_Cart__c 
                            WHERE ownerId =: userId 
                            AND  Cart_Status__c = 'Open'
                            LIMIT 1];
        } 
        // create a new instance of the BoardCartResult object
        BoardCartResult cartResult = new BoardCartResult();
        cartResult.cartHeader = currentCarts[0];
        
        // now check all the lines in that cart
        cartResult.cartLines = [SELECT Id, Name, Board__r.Name, Price__c, Quantity__c
                                FROM Boardstore_Cart_Line__c
                                WHERE Boardstore_Cart__c =: cartResult.cartHeader.Id];

        return cartResult;

    }
}
