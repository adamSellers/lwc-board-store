import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartTotals extends LightningElement {
  @api total;
  @api tax;
  @api subtotal;

  handleCheckout() {
    this.dispatchEvent(new CustomEvent('checkout'));
  }
}