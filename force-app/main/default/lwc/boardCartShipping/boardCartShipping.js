import {
  LightningElement,
  api
} from 'lwc';

export default class BoardCartShipping extends LightningElement {
  @api recordId;
  @api street;
  @api city;
  @api state;
  @api country;
  @api zip;

  connectedCallback() {
    this.shippingDetails = {
      idToUpdate: this.recordId,
      updatedStreet: this.street,
      updatedCity: this.city,
      updatedState: this.state,
      updatedCountry: this.country,
      updatedZip: this.zip
    };
  }

  handleUpdateStreet(event) {
    this.shippingDetails.updatedStreet = event.detail.value;
  }

  handleUpdateCity(event) {
    this.shippingDetails.updatedCity = event.detail.value;
  }

  handleUpdateState(event) {
    this.shippingDetails.updatedState = event.detail.value;
  }

  handleUpdateZip(event) {
    this.shippingDetails.updatedZip = event.detail.value;
  }

  handleUpdateCountry(event) {
    this.shippingDetails.updatedCountry = event.detail.value;
  }

  handleContinue() {
    /** fire a custom event to the shopping cart with new shipping details */
    const shippingUpdatedEvent = new CustomEvent('shippingupdate', {
      detail: this.shippingDetails
    });

    this.dispatchEvent(shippingUpdatedEvent);
  }
}