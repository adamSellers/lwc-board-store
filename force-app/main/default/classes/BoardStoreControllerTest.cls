@isTest
public class BoardStoreControllerTest {
    @isTest 
    static void testGetBoards() {
        // Create test Board record
        Board__c board = new Board__c(
            Name = 'Test Board',
            Price__c = 100,
            Width__c = 'Wide',
            Flex__c = 'Soft',
            Camber__c = 'Hybrid',
            Mounting_Pattern__c = '4x4'
        );
        insert board;

        // Create Filters
        BoardstoreController.Filters filters = new BoardstoreController.Filters();
        filters.searchKey = 'Test';
        filters.maxPrice = 200;
        filters.width = new String[] {'Wide'};
        filters.flex = new String[] {'Soft'};
        filters.camber = new String[] {'Hybrid'};
        filters.mountingPattern = new String[] {'4x4'};

        // Convert Filters to JSON
        String filtersJson = JSON.serialize(filters);

        // Call getBoards method
        Test.startTest();
        PagedResult result = BoardstoreController.getBoards(filtersJson, 1);
        Test.stopTest();

        // Assertions
        System.assertEquals(1, result.records.size(), 'Incorrect number of records returned');
        // System.assertEquals(board.Id, result.records[0].Id, 'Incorrect record returned');
    }
}
