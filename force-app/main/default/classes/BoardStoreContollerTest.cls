@isTest
private class BoardStoreContollerTest {
    @isTest
    static void testGetBoards() {
        // create a list of snowboards
        List<Board__c> testBoards = new List<Board__c>();
        for (Integer i=0; i<100; i++) {
            Board__c singleBoard = new Board__c(
                Name = 'Board ' + i
            );
            testBoards.add(singleBoard);
        }
        insert testBoards;

        // now assert there were 100 snowboards added
        PagedResult boardsToTest = BoardstoreController.getBoards('{}', 1);
        System.assertEquals(9, boardsToTest.records.size());
    }
}
