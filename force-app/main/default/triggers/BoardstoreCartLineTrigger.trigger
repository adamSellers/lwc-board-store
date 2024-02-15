trigger BoardstoreCartLineTrigger on Boardstore_Cart_Line__c (before update) {
    // trigger only runs in update context as cart header trigger sets rate on insert

    Map<Id, String> cartLineIdToRate = new Map<Id, String>();
    for (Boardstore_Cart_Line__c line : Trigger.new) {
        // pass the cart ID and the User to the map
        String localeSidKey = [SELECT Id, Name, LocaleSidKey FROM User WHERE Id = :line.CreatedById].localeSidKey;
        cartLineIdToRate.put(line.Boardstore_Cart__c, localeSidKey);
    }
    // call the tax util class to reset the header tax
    CartHeaderTaxUtil.updateCartTaxRate(cartLineIdToRate);

}