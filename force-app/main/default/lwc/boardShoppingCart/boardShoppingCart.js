/******************************************************************************
 * A simple shopping cart implementation in LWC. To be included in the boardStore
 * container component.
 * V0.01
 * 23rd Feb 2019
 * Adam Sellers
 * asellers@salesforce.com
 */
import {
  LightningElement,
  track,
  wire
} from 'lwc';

/** Import the UI API functions needed */
import {
  createRecord,
  deleteRecord,
  updateRecord
} from 'lightning/uiRecordApi';
import {
  CurrentPageReference
} from 'lightning/navigation';
import {
  ShowToastEvent
} from 'lightning/platformShowToastEvent';
/** get the current user's ID */
import Id from '@salesforce/user/Id';

/** Import the necessary Objects, fields and controller */
import getCartHeader from '@salesforce/apex/BoardCartController.getCartHeader';
import CART_LINE_OBJECT from '@salesforce/schema/Boardstore_Cart_Line__c';
import QUANTITY_FIELD from '@salesforce/schema/Boardstore_Cart_Line__c.Quantity__c';
import PRICE_FIELD from '@salesforce/schema/Boardstore_Cart_Line__c.Price__c';
import BOARD_FIELD from '@salesforce/schema/Boardstore_Cart_Line__c.Board__c';
import CART_HEADER_FIELD from '@salesforce/schema/Boardstore_Cart_Line__c.Boardstore_Cart__c';
import SHIPPING_STREET_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Street__c';
import SHIPPING_CITY_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_City__c';
import SHIPPING_STATE_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_State__c';
import SHIPPING_ZIP_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Post_Code_Zip__c';
import SHIPPING_COUNTRY_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Country__c';
import SHIPPING_CONFRIMED_FIELD from '@salesforce/schema/Boardstore_Cart__c.Shipping_Details_Confirmed__c';
import ID_FIELD from '@salesforce/schema/Boardstore_Cart__c.Id';
import CART_STATUS_FIELD from '@salesforce/schema/Boardstore_Cart__c.Cart_Status__c';

/** Import pubsub mechanism */
import {
  unregisterAllListeners,
  registerListener
} from 'c/pubsub';
export default class BoardShoppingCart extends LightningElement {
  @track userId = Id;
  @track cartResult;
  @track shippingDetails = false;
  @track processPayment = false;
  @track shoppingCart = false;
  showButton = true;

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    /** using imperative apex call, so have to do on connected 
     * callback as an init. Imperative apex call required as there
     * is a possibility that the Apex controller will do DML, therefore
     * can't be set to cacheable=true => no wire service available.
     */
    this.shoppingCart = true;
    this.performImperativeApexRefresh();
    /** register the event listener also */
    registerListener('boardAddedToCart', this.receiveAddToCart, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  /** function that handles the data passed in via the addToCart event */
  receiveAddToCart(lineDetails) {
    /** Take line details and setup the recordInput object */
    let fields = {};
    fields[BOARD_FIELD.fieldApiName] = lineDetails.boardId;
    fields[QUANTITY_FIELD.fieldApiName] = lineDetails.quantity;
    fields[PRICE_FIELD.fieldApiName] = lineDetails.price;
    fields[CART_HEADER_FIELD.fieldApiName] = this.cartResult.cartHeader.Id;
    let recordInput = {
      apiName: CART_LINE_OBJECT.objectApiName,
      fields
    };

    /** pass recordInput to createRecord function and notify user */
    createRecord(recordInput)
      .then(cartLine => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Board Inserted',
            variant: 'success',
            message: cartLine.fields.Board__r.displayValue + ' added to the cart.'
          })
        );
        /** refresh the cart lines */
        this.performImperativeApexRefresh();
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error when inserting record',
            message: error.body.message,
            variant: 'error'
          })
        );
      });
  }

  /** function to handle a deleted line from the cart */
  handleDeleteLine(event) {
    deleteRecord(event.detail)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'Record ID: ' + event.detail + ' deleted successfully.'
          })
        );
        /** refresh the cart lines */
        this.performImperativeApexRefresh();
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error when deleting record',
            message: error.body.message,
            variant: 'error'
          })
        );
      });
  }

  handleCheckout() {
    this.toggleShippingDetails();
  }

  performImperativeApexRefresh() {
    getCartHeader({
        userId: this.userId
      })
      .then((result) => {
        this.cartResult = result;
        console.log('apex refreshed! cart details are: ' + JSON.stringify(this.cartResult));
      })
      .catch(error => {
        this.error = error;
      });
  }

  handleUpdatedShipping(event) {
    /** this function will update the cart record with shipping details
     *  and set the payment flag to display the payment options
     */
    /** setup the record input object */
    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.cartResult.cartHeader.Id;
    fields[SHIPPING_STREET_FIELD.fieldApiName] = event.detail.updatedStreet;
    fields[SHIPPING_CITY_FIELD.fieldApiName] = event.detail.updatedCity;
    fields[SHIPPING_STATE_FIELD.fieldApiName] = event.detail.updatedState;
    fields[SHIPPING_COUNTRY_FIELD.fieldApiName] = event.detail.updatedCountry;
    fields[SHIPPING_ZIP_FIELD.fieldApiName] = event.detail.updatedZip;
    fields[SHIPPING_CONFRIMED_FIELD.fieldApiName] = true;

    const recordInput = {
      fields
    };

    /** update the record, this returns a promise */
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Shipping Confirmed',
            variant: 'success',
            message: 'Thanks for confirming your shipment details'
          })
        );

        /** set the payment details and shipping flags to display the next component */
        this.shippingDetails = false;
        this.processPayment = true;
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Oops!',
            variant: 'error',
            message: error.body.message
          })
        );
      });
  }

  handleShippingBack() {
    this.toggleShippingDetails();
  }

  handlePaymentBack() {
    this.shippingDetails = true;
    this.processPayment = false;
  }

  toggleShippingDetails() {
    this.shippingDetails = !this.shippingDetails;
    this.shoppingCart = !this.shoppingCart;
    this.showButton = !this.showButton;
  }

  handleOrderPlaced() {
    /** This is simply going to upate the cart status to closed and an apex
     * trigger will handle the creating of the order and order lines.
     */
    const cartFields = {};
    cartFields[ID_FIELD.fieldApiName] = this.cartResult.cartHeader.Id;
    cartFields[CART_STATUS_FIELD.fieldApiName] = 'Closed';

    console.log('the fields are: ' + JSON.stringify(cartFields));
    const orderUpdate = {
      cartFields
    };

    updateRecord(orderUpdate)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Order Received',
            variant: 'success',
            message: 'Order Placed'
          })
        );

        /** set the payment details and shipping flags to display the next component */
        this.shippingDetails = false;
        this.processPayment = false;
        this.shoppingCart = true;
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Oops!',
            variant: 'error',
            message: error.body.message
          })
        );
      });
  }

  /** stuff used for debugging and console logging */
  // logOutStuff(dataToLog, logmessage) {
  //   console.log(logmessage + JSON.stringify(dataToLog));
  // }

  // renderedCallback() {
  //   this.times++;
  //   console.log('render callback called this... ' + this.times);
  //   this.logOutStuff(this.userId, 'The user ID is: ');
  //   this.logOutStuff(this.cartResult, 'The cart result is: ');
  // }
  /************** END DEBUGGING *****************************/
}