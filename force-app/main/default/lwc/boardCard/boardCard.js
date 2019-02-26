import {
  LightningElement,
  wire
} from 'lwc';
import {
  CurrentPageReference,
  NavigationMixin
} from 'lightning/navigation';

/* Wire adapter to load record detail */
import {
  getRecord
} from 'lightning/uiRecordApi';

/* pub/sub mechanism for sibling component comms */
import {
  registerListener,
  unregisterAllListeners
} from 'c/pubsub';

/** Import the schema from Board__c as required */
import BOARD_OBJECT from '@salesforce/schema/Board__c';
import NAME_FIELD from '@salesforce/schema/Board__c.Name';
import LEVEL_FIELD from '@salesforce/schema/Board__c.Ability_Level__c';
import CAMBER_FIELD from '@salesforce/schema/Board__c.Camber__c';
import SIZE_FIELD from '@salesforce/schema/Board__c.Size__c';
import PRICE_FIELD from '@salesforce/schema/Board__c.Price__c';
import IMAGE_NAME_FIELD from '@salesforce/schema/Board__c.Image_Name__c';
import TYPE_FIELD from '@salesforce/schema/Board__c.Snowboard_Type__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Board__c.Description__c';

/** static resource of product images */
import BOARD_IMAGES from '@salesforce/resourceUrl/boardImages';

/** record fields to load.. */
const fields = [
  NAME_FIELD,
  LEVEL_FIELD,
  CAMBER_FIELD,
  SIZE_FIELD,
  PRICE_FIELD,
  IMAGE_NAME_FIELD,
  TYPE_FIELD,
  DESCRIPTION_FIELD
]

/** Component to display the fields of Board__c */
export default class BoardCard extends LightningElement {
  /** Id of the board */
  recordId;

  @wire(CurrentPageReference) pageRef;

  /** load the board to display */
  @wire(getRecord, {
    recordId: '$recordId',
    fields
  })
  board;

  /** register the listener upon component load */
  connectedCallback() {
    registerListener('boardSelected', this.handleBoardSelected, this);
  }

  renderedCallback() {
    console.log('the name field object: ' + JSON.stringify(IMAGE_NAME_FIELD.fieldApiName));
  }

  /** unregister the listener upon component destruction */
  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  /** handler for when a board is selected. When the recordId changes, 
   * the wire service above will update the data
   */
  handleBoardSelected(boardId) {
    this.recordId = boardId;
  }

  /** handle the navigation event, a click will navigate to the SF record. 
   * TODO - implement the add to cart functionality here instead of a nav
   * event.
   */
  handleNavigateToRecord() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        objectApiName: BOARD_OBJECT.objectApiName,
        actionName: 'view'
      }
    });
  }

  get noData() {
    return !this.board.error && !this.board.data;
  }

  /** getter for the image url */
  get boardImageUrl() {
    let imgUrl = BOARD_IMAGES + '/images/thumbs200/' + this.board.data.fields.Image_Name__c.value;
    return imgUrl;
  }
}