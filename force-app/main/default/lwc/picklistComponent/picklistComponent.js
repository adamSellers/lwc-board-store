import {
  LightningElement,
  wire
} from 'lwc';
import {
  getPicklistValues
} from 'lightning/uiObjectInfoApi';
import CAMBER_FIELD from '@salesforce/schema/Board__c.Camber__c';

export default class PicklistComponent extends LightningElement {
  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: CAMBER_FIELD
  })
  logData(data) {
    console.log('fields data is: ' + JSON.stringify(data));
  }
}