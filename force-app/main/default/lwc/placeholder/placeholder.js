import {
  LightningElement,
  api,
  track
} from 'lwc';

import BOARD_IMAGES from '@salesforce/resourceUrl/boardImages';

export default class Placeholder extends LightningElement {
  @api message;

  @track shredLogo = BOARD_IMAGES + '/shredHeadLogo.png';

}