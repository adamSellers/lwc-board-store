/**************************************************************
 * The boardTile is the view of a single board, this is dispalyed
 * in the boardTileList component. This exposes the add to cart functionality.
 * All properties in this component must be passed in from the containing component.
 * V0.01
 * 25th Feb 2019
 * Adam Sellers
 * asellers@salesforce.com
 */
import {
  LightningElement,
  api,
  track
} from 'lwc';

export default class BoardTile extends LightningElement {
  /* Is the single tile draggable */
  @api draggable

  /* the board record */
  _board;

  @api get board() {
    return this._board;
  }

  set board(value) {
    this._board = value;
    this.pictureUrl = value.Board_Thumbnail__c;
    this.name = value.Name;
    this.price = value.Price__c;
  }

  /* Board__c values to display */
  @track pictureUrl;
  @track name;
  @track price;

  connectedCallback() {
    console.log('this thing mounted with data: ' + JSON.stringify(this._board));
  }

  handleClick() {
    /* emit a custom event that identifies the record clicked on */
    const selectedBoard = new CustomEvent('selected', {
      detail: this.board.Id
    });

    this.dispatchEvent(selectedBoard);
  }

  handleDragStart(event) {
    event.dataTransfer.setData('board', JSON.stringify(this.board));
  }
}