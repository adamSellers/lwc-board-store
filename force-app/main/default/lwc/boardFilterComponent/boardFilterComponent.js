import {
  LightningElement,
  track
} from 'lwc';

export default class BoardFiltersHeader extends LightningElement {
  @track showFilters = false;

  get showFilters() {
    return this.showFilters;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}