import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartHeader extends LightningElement {
  _cartHeader;

  @api get cartHeader() {
    return this._cartHeader;
  }

  set cartHeader(value) {
    this._cartHeader = value;
  }
}