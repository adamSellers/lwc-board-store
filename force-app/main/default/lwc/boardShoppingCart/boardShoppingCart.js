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
  deleteRecord
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

/** Import pubsub mechanism */
import {
  unregisterAllListeners,
  registerListener
} from 'c/pubsub';
export default class BoardShoppingCart extends LightningElement {
  @track userId = Id;
  @track cartResult;

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    /** using imperative apex call, so have to do on connected 
     * callback as an init. Imperative apex call required as there
     * is a possibility that the Apex controller will do DML, therefore
     * can't be set to cacheable=true => no wire service available.
     */
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
}