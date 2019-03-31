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
  @track _useDefaultShippingDetails = false;

  handlePlaceOrder() {
    /** assuming payment confirmation is good! (TODO!!) */
    const billingAddress = {
      billingStreet: this.street,
      billingCity: this.city,
      billingState: this.state,
      billingZip: this.zip,
      billingCountry: this.country
    };

    const orderEvent = new CustomEvent('orderplaced', {
      detail: billingAddress
    });

    this.dispatchEvent(orderEvent);
  }

  handleBackButton() {
    this.dispatchEvent(new CustomEvent('backbutton'));
  }

  handleUseShippingAddress() {
    this._useDefaultShippingDetails = !this._useDefaultShippingDetails;
    if (this._useDefaultShippingDetails) {
      this._street = this.street;
      this._city = this.city;
      this._state = this.state;
      this._zip = this.zip;
      this._country = this.country;
    } else {
      this._street = '';
      this._city = '';
      this._state = '';
      this._zip = '';
      this._country = '';
    }
  }
}