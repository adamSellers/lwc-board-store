public with sharing class CartHeaderTaxUtil {
    public static void updateCartTaxRate(Map<Id, String> carts) {
        // Create list of cart Ids to update
        List<Boardstore_Cart__c> cartList = new List<Boardstore_Cart__c>();

        // loop through the map
        for (Id cartId : carts.keySet()) {
            // Get the cart
            Boardstore_Cart__c cart = new Boardstore_Cart__c(Id = cartId);
            // Get the tax rate
            Decimal taxRate = [SELECT Tax_Rate__c FROM Tax_Rate__mdt WHERE DeveloperName =: carts.get(cartId) LIMIT 1].Tax_Rate__c;
            // Set the tax rate
            cart.User_Tax_Rate__c = taxRate;
            // Add the cart to the list
            cartList.add(cart);
        }
        update cartList;
    }
}