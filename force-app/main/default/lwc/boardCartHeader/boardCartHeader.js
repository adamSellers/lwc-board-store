import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartHeader extends LightningElement {
  _cartHeader;

  @api get cartHeader() {
    return this._cartHeader;
  }

  set cartHeader(value) {
    this._cartHeader = value;
    this.name = value.Name;
    this.status = value.Cart_Status__c;
    this.subtotal = value.Cart_Subtotal__c;
    this.tax = value.Tax__c // TODO - implement better tax rate handling
    this.cartTotal = value.Cart_Total__c;
    this.totalItems = value.Total_Items__c;
    this.shippingDetails = {
      street: value.Shipping_Street__c,
      city: value.Shipping_City__c,
      state: value.Shipping_State__c,
      zip: value.Shipping_Post_Code_Zip__c,
      country: value.Shipping_Country__c
    }
  }

  renderedCallback() {
    console.log('the rendered callback in the cart header: ' + JSON.stringify(this._cartHeader));
  }
}