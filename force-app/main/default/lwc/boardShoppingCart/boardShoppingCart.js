/******************************************************************************
 * A simple shopping cart implementation in LWC. To be included in the boardStore
 * container component.
 * V0.01
 * 23rd Feb 2019
 * Adam Sellers
 * asellers@salesforce.com
 * Things TODO: 
 * 1. Create Apex controller for cart and cart line details
 * 2. Tie user record to cart lookup - only one open cart record per user.
 * 3. Receive event from board card for add to cart and insert into Board_Cart_Lines__c
 * 4. Header totals and tax become a function of the line records and tax information (where to put that?)
 */
import {
  LightningElement,
  track,
  wire
} from 'lwc';

/** Import the UI API functions needed */
import {
  createRecord
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
  registerListener,
  fireEvent
} from 'c/pubsub';
export default class BoardShoppingCart extends LightningElement {
  @track userId = Id;
  @track cartLines = [];
  @track cartHeader;
  times = 0;

  @wire(CurrentPageReference) pageRef;

  /** Setup the wire services required
   * 1 - get an open cart from Board_Cart__c
   * 2 - for that cart ID, get associated lines
   */
  connectedCallback() {
    /** using imperative apex call, so have to do on connected 
     * callback as an init.
     */
    getCartHeader({
        userId: this.userId
      })
      .then((result) => {
        this.cartHeader = result[0];
        this.logOutStuff(this.cartHeader, 'cartHeader returned with: ');
      })
      .catch(error => {
        console.error('error! it threw this: ' + error);
      });

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
    fields[CART_HEADER_FIELD.fieldApiName] = this.cartHeader.Id;
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
        )
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Something went wrong..',
            message: error.body.message,
            variant: 'error'
          })
        );
      });

  }

  /** stuff used for debugging and console logging */
  logOutStuff(dataToLog, logmessage) {
    console.log(logmessage + JSON.stringify(dataToLog));
  }

  renderedCallback() {
    this.times++;
    console.log('render callback called this... ' + this.times);
    this.logOutStuff(this.userId, 'The user ID is: ');
    this.logOutStuff(this.cartHeader, 'The cart header is: ');
  }
  /************** END DEBUGGING *****************************/
}