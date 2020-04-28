import {
  LightningElement,
  api,
  track
} from 'lwc';

export default class BoardCartPayment extends LightningElement {
  /** shipping address details */
  @api street;
  @api city;
  @api state;
  @api zip;
  @api country;

  /** billing address fields */
  _street;
  _city;
  _state;
  _zip;
  _country;
  billingAdress;
  @track _useDefaultShippingDetails = false;

  handlePlaceOrder() {
    /** assuming payment confirmation is good! (TODO!!) */
    if (!this._useDefaultShippingDetails) {
      this.billingAddress = {
        billingStreet: this._street,
        billingCity: this._city,
        billingState: this._state,
        billingZip: this._zip,
        billingCountry: this._country
      };
    }
    const orderEvent = new CustomEvent('orderplaced', {
      detail: this.billingAddress
    });

    this.dispatchEvent(orderEvent);
  }

  handleBackButton() {
    this.dispatchEvent(new CustomEvent('backbutton'));
  }

  handleUseShippingAddress() {
    this._useDefaultShippingDetails = !this._useDefaultShippingDetails;
    if (this._useDefaultShippingDetails) {
      this.billingAddress = {
        billingStreet: this.street,
        billingCity: this.city,
        billingState: this.state,
        billingZip: this.zip,
        billingCountry: this.country
      };
    }
  }

  updateBillingDetails(event) {
    // switch statement to catch all fields in the form
    switch(event.target.name) {
      case 'billingStreet':
        this._street = event.target.value;
        break;
      case 'billingCity':
        this.city = event.target.value;
        break;
      case 'billingState':
        this._state = event.target.value;
        break;
      case 'billingZip':
        this._zip = event.target.value;
        break;
      default:
        this._country = event.target.value;
    }
  }
}