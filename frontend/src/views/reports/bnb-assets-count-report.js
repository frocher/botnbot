import { BnbAssetsReport } from './bnb-assets-report';

class BnbAssetsCountReport extends BnbAssetsReport {
  backTapped() {
    this.goto(`requests-details/${this.page.id}`);
  }
}

window.customElements.define('bnb-assets-count-report', BnbAssetsCountReport);
