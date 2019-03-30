import {
  LightningElement
} from 'lwc';

export default class BoardCartPayment extends LightningElement {

  handlePlaceOrder() {
    /** assuming payment confirmation is good! (TODO!!) */
    this.dispatchEvent(new CustomEvent('orderplaced'));
  }

  handleBackButton() {
    this.dispatchEvent(new CustomEvent('backbutton'));
  }
}