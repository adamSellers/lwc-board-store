/****************************************************************************
 * The boardTileList component will display a list of board tile components that
 * meet the entered search criteria.
 * V0.01
 * 23rd Feb 2019
 * Adam Sellers
 * asellers@salesforce.com
 * taken pretty much exclusively from here: https://github.com/trailheadapps/ebikes-lwc
 */
import {
  LightningElement,
  wire,
  track,
  api
} from 'lwc';
import {
  CurrentPageReference
} from 'lightning/navigation';

/* getBoards() method from the Apex Controller */
import getBoards from '@salesforce/apex/BoardstoreController.getBoards';

/* Pub/Sub methods for sibling component communications */
import {
  registerListener,
  unregisterAllListeners,
  fireEvent
} from 'c/pubsub';

export default class BoardTileList extends LightningElement {
  // for a searchbar
  @api searchBarIsVisible = false;

  // are tile draggable? 
  @api tilesAreDraggable = false;

  // array to hold the boards
  @track boards = [];

  // current page number in the product list
  @track pageNumber = 1;

  // the number of items on a page
  @track pageSize;

  // the number of items that match the selections
  @track totalItemCount = 0;

  // filters are passed into the apex controller as JSON stringified
  filters = '{}';

  @wire(CurrentPageReference) pageRef;

  // load all the boards
  @wire(getBoards, {
    filters: '$filters',
    pageNumber: '$pageNumber'
  })
  boards;

  connectedCallback() {
    registerListener('filterChange', this.handleFilterChange, this);
  }

  handleBoardSelected(event) {
    fireEvent(this.pageRef, 'boardselected', event.detail);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleSearchKeyChange(event) {
    const searchKey = event.target.value.toLowerCase();
    this.handleFilterChange({
      searchKey
    });
  }

  handleFilterChange(filters) {
    this.filters = JSON.stringify(filters);
    this.pageNumber = 1;
  }

  handlePreviousPage() {
    this.pageNumber = this.pageNumber - 1;
  }

  handleNextPage() {
    this.pageNumber = this.pageNumber + 1;
  }
}