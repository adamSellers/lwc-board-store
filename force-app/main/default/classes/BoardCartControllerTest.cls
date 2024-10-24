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
