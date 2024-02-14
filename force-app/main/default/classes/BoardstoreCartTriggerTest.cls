/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class BoardstoreCartTriggerTest {

    @isTest
    static void defaultTax() {
        // create a cart record and check that it's there with 10% tax rate without the custom metadata record
        Boardstore_Cart__c cart = new Boardstore_Cart__c();
        cart.Cart_Status__c = 'Open';

        insert cart;
        System.assertEquals(10.00, [SELECT User_Tax_Rate__c FROM Boardstore_Cart__c WHERE Id = :cart.Id].User_Tax_Rate__c);
    }

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
}