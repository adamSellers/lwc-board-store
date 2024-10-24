/**
 * Test Class to test the BoardstoreCartTrigger and BoardstoreCartLineTrigger
 * 
 */
@isTest
private class BoardstoreCartTriggerTest {

    // @isTest
    // static void defaultTax() {
    //     // create a cart record and check that it's there with 10% tax rate without the custom metadata record
    //     Boardstore_Cart__c cart = new Boardstore_Cart__c();
    //     cart.Cart_Status__c = 'Open';

    //     insert cart;
    //     System.assertEquals(10.00, [SELECT User_Tax_Rate__c FROM Boardstore_Cart__c WHERE Id = :cart.Id].User_Tax_Rate__c);
    // }

    @isTest
    static void usTax() {
        // create US user
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);

        System.runAs(u) {
            Boardstore_Cart__c cart = new Boardstore_Cart__c();
            cart.Cart_Status__c = 'Open';

            insert cart;
            System.assertEquals(15.00, [SELECT User_Tax_Rate__c FROM Boardstore_Cart__c WHERE Id = :cart.Id].User_Tax_Rate__c);
        }
    }

    @isTest
    static void lineUpdateResetsTax() {
        // create US user
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);

        System.runAs(u) {
        // create a cart record
        Boardstore_Cart__c cart = new Boardstore_Cart__c();
        cart.Cart_Status__c = 'Open';
        insert cart;
        
        // create a board
        Board__c board = new Board__c();
        board.Name = 'Test Board';
        board.Price__c = 100.00;
        insert board;

        // insert a line
        Boardstore_Cart_Line__c line = new Boardstore_Cart_Line__c();
        line.Board__c = board.Id;
        line.Quantity__c = 1;
        line.Boardstore_Cart__c = cart.Id;
        line.Price__c = board.Price__c;
        insert line;

        // update the line to trigger the line update
        line.Quantity__c = 2;
        update line;
        
        // check that the tax rate is 15%
        System.assertEquals(15.00, [SELECT User_Tax_Rate__c FROM Boardstore_Cart__c WHERE Id = :cart.Id].User_Tax_Rate__c);
        }
    }
}