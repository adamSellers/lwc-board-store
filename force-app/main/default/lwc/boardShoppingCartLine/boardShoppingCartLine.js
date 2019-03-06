import {
  LightningElement,
  api
} from 'lwc';

export default class BoardShoppingCartLine extends LightningElement {
  /** the cart line record with getter and setter */
  _cartLine

  @api get cartLine() {
    return this._cartLine;
  }

  set cartLine(value) {
    this._cartLine = value;
    this.price = value.Price__c;
    this.quantity = value.Quantity__c;
    this.subtotal = this.price * this.quantity;
    this.boardName = value.Board__r.Name;
  }
}