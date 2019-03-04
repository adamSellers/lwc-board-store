/** This component will allow a user to select from the available filters
 * for the board search. 
 * TODO: Need to implement the dynamic handling of the user's default record type
 * id for the board object.
 * 2nd March 2019
 * V0.01
 * Adam Sellers
 * asellers@salesforce.com
 */
import {
  LightningElement,
  wire,
  track
} from 'lwc';
import {
  CurrentPageReference
} from 'lightning/navigation';
import {
  getPicklistValues
} from 'lightning/uiObjectInfoApi';
import CAMBER_FIELD from '@salesforce/schema/Board__c.Camber__c';
import FLEX_FIELD from '@salesforce/schema/Board__c.Flex__c';
import MOUNTING_PATTERN_FIELD from '@salesforce/schema/Board__c.Mounting_Pattern__c';
import WIDTH_FIELD from '@salesforce/schema/Board__c.Width__c';

/** Grab the pubsub mechansim from service component */
import {
  fireEvent
} from 'c/pubsub';

/** set a delay for debouncing event handlers before firing the event */
const DELAY = 350;

/** Displays a filter panel to search for Board__c records */
export default class BoardFilters extends LightningElement {
  @track searchKey = 'Please Enter a search string';
  @track maxPrice = 1000;
  times = 0;

  filters = {
    searchKey: '',
    maxPrice: 1000
  };

  @wire(CurrentPageReference)
  pageRef;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: CAMBER_FIELD
  })
  cambers;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: WIDTH_FIELD
  })
  widths;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: MOUNTING_PATTERN_FIELD
  })
  mountingPatterns;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: FLEX_FIELD
  })
  flexes;

  handleResetFilters() {
    this.initialiseFilters(true);
  }

  handleSearchKeyChange(event) {
    const key = event.target.value;
    this.filters.searchKey = key;
    this.delayedFireFilterChangeEvent();
  }

  handleMaxPriceChange(event) {
    this.filters.maxPrice = event.target.value;
    this.delayedFireFilterChangeEvent();
  }

  handleCheckBoxChange(event) {
    if (!this.filters.camber) {
      /** so we have no filters set just yet, initialise all with all values set.
       */
      this.initialiseFilters(false);
    }
    const value = event.target.dataset.value;
    const filterArray = this.filters[event.target.dataset.filter];
    if (event.target.checked) {
      if (!filterArray.includes(value)) {
        filterArray.push(value);
      }
    } else {
      this.filters[event.target.dataset.filter] = filterArray.filter(
        item => item !== value
      );
    }
    /** fire the event that sends the filters to the apex controller */
    fireEvent(this.pageRef, 'filterChange', this.filters);
  }

  delayedFireFilterChangeEvent() {
    /** Do not fire an event until the delay has expired. This avoids
     * too many apex requests being sent on changes.
     */
    window.clearTimeout(this.delayTimeout);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      fireEvent(this.pageRef, 'filterChange', this.filters);
    }, DELAY);
  }

  initialiseFilters(fullReset) {
    /** check to see if we want search and price reset
     * or if this is a call from the initalisation
     */
    if (fullReset) {
      this.filters.searchKey = '';
      this.searchKey = '';
      this.maxPrice = 1000;
      this.filters.maxPrice = 1000;
      console.log('full reset done - serach key is now: ' + this.searchKey);
    }
    this.filters.camber = this.cambers.data.values.map(
      item => item.value
    );

    this.filters.flex = this.flexes.data.values.map(
      item => item.value
    );

    this.filters.width = this.widths.data.values.map(
      item => item.value
    );

    this.filters.mountingPattern = this.mountingPatterns.data.values.map(
      item => item.value
    );

    /** fire the event that sends the filters to the apex controller */
    fireEvent(this.pageRef, 'filterChange', this.filters);
  }
}