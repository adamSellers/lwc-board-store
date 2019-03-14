import {
  LightningElement,
  api,
  track,
  wire
} from 'lwc';

/** Imports for Salesforce record data */
import {
  getRecord
} from 'lightning/uiRecordApi';
// import BOARD_CART_OBJECT from '@salesforce/schema/Boardstore_Cart__c';
import NAME_FIELD from '@salesforce/schema/Boardstore_Cart__c.Name';
import STATUS_FIELD from '@salesforce/schema/Boardstore_Cart__c.Cart_Status__c';
import SUBTOTAL_FIELD from '@salesforce/schema/Boardstore_Cart__c.Cart_Subtotal__c';
import TAX_FIELD from '@salesforce/schema/Boardstore_Cart__c.Tax_Total__c';
import TOTAL_ITEMS_FIELD from '@salesforce/schema/Boardstore_Cart__c.Total_Items__c';
import STREET_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Street__c';
import CITY_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_City__c';
import STATE_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_State__c';
import ZIP_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Post_Code_Zip__c';
import COUNTRY_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Country__c';
import TOTAL_CART_FIELD from '@salesforce/schema/Boardstore_Cart__c.Total_Cart__c';

const FIELDS = [
  NAME_FIELD,
  STATUS_FIELD,
  SUBTOTAL_FIELD,
  TAX_FIELD,
  TOTAL_CART_FIELD,
  TOTAL_ITEMS_FIELD,
  STREET_FIELD,
  CITY_FIELD,
  STATE_FIELD,
  ZIP_FIELD,
  COUNTRY_FIELD
]

export default class BoardCartHeader extends LightningElement {
  @api recordId;

  /** tracking necessary items for refresh */
  @track _cart;
  @track name;
  @track status;
  @track subtotal;
  @track tax;
  @track cartTotal;
  @track totalItems;
  @track shippingDetails = {};

  @wire(getRecord, {
    recordId: '$recordId',
    fields: FIELDS
  })
  wireRecord({
    error,
    data
  }) {
    if (error) {
      this.error = error;
    } else if (data) {
      this._cart = data;
      this.name = data.fields.Name.value;
      this.status = data.fields.Cart_Status__c.value;
      this.subtotal = data.fields.Cart_Subtotal__c.value;
      this.tax = data.fields.Tax_Total__c.value;
      this.cartTotal = data.fields.Total_Cart__c.value;
      this.totalItems = data.fields.Total_Items__c.value;
      this.shippingDetails = {
        street: data.fields.Shipping_Street__c.value,
        city: data.fields.Shipping_City__c.value,
        state: data.fields.Shipping_State__c.value,
        zip: data.fields.Shipping_Post_Code_Zip__c.value,
        country: data.fields.Shipping_Country__c.value
      }
    }
  }
}