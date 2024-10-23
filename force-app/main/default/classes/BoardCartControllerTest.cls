<<<<<<< HEAD
@isTest
public class BoardCartControllerTest {
    @isTest 
    static void testGetCartHeader() {
        // Create a Test User
        Profile p = [SELECT Id FROM Profile WHERE Name='System Administrator'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
        LocaleSidKey='en_US', ProfileId = p.Id, 
        TimeZoneSidKey='America/Los_Angeles', UserName='standarduser@testorg.com');
        insert u;

        // Use System.runAs to ensure the test is run under the context of the user
        System.runAs(u) {
            Test.startTest();
            BoardCartResult res = BoardCartController.getCartHeader(u.Id);
            Test.stopTest();

            // Verify that a cart has been created for the user
            List<Boardstore_Cart__c> userCarts = [SELECT Id FROM Boardstore_Cart__c WHERE ownerId =: u.Id AND Cart_Status__c = 'Open' LIMIT 1];
            System.assert(userCarts.size() == 1, 'Cart not created for the user');

            // Verify that the cart header returned matches the created cart
            System.assertEquals(userCarts[0].Id, res.cartHeader.Id, 'Incorrect cart header returned');
            
        }
    }
}
=======
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
private class BoardCartControllerTest {

    @isTest
    static void getUserCarts() {

        // create a user
        User u = new User();
        u.FirstName = 'Test';
        u.LastName = 'User';
        u.Email = 'test@test.com';
        u.Username = 'test@test.com';  
        u.Alias = 'test';
        u.CommunityNickname = 'test';
        u.TimeZoneSidKey = 'America/Los_Angeles';
        u.LocaleSidKey = 'en_US';
        u.LanguageLocaleKey = 'en_US';
        u.EmailEncodingKey = 'UTF-8';
        u.ProfileId = [SELECT Id FROM Profile WHERE Name='Standard User'].Id;
        insert u;

        // call the board cart controller to return an open header
        BoardCartResult result = BoardCartController.getCartHeader(u.Id);

        // verify the result
        System.assertEquals(result.cartHeader.Cart_Status__c, 'Open');
    }
}
>>>>>>> origin/main
