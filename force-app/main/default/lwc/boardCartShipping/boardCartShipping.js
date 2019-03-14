import {
  LightningElement,
  api
} from 'lwc';

/** get fields and object required for lightning-record-form */

export default class BoardCartShipping extends LightningElement {
  @api recordId

  handleSubmit() {
    console.log('the button is clicked');
  }
}