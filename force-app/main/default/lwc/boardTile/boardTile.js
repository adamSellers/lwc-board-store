/**************************************************************
 * The boardTile is the view of a single board, this is dispalyed
 * in the boardTileList component. A click on this fires an event to the board detail tile
 * which in turn, will expose the add to cart functionality.
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
/* grab the images from static resources */
import boardImages from '@salesforce/resourceUrl/boardImages';

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
    this.imageName = value.Image_Name__c;
    this.thumbUrl = boardImages + '/images/thumbs80/' + this.imageName;
    this.name = value.Name;
    this.price = value.Price__c;
  }

  /* Board__c values to display */
  @track pictureUrl;
  @track name;
  @track price;

  handleBoardSelected() {
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