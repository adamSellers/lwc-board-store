import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartLines extends LightningElement {
  _boardCartLines;

  @api get boardCartLines() {
    return this._boardCartLines;
  }

  set boardCartLines(value) {
    this._boardCartLines = value;
  }
}