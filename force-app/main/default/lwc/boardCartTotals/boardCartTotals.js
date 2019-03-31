import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartTotals extends LightningElement {
  @api total;
  @api tax;
  @api subtotal;
  @api showbutton;

  handleCheckout() {
    this.dispatchEvent(new CustomEvent('checkout'));
  }
}