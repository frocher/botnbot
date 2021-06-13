import { BnbAssetsReport } from './bnb-assets-report';

class BnbAssetsSizeReport extends BnbAssetsReport {
  backTapped() {
    this.goto(`bytes-details/${this.page.id}`);
  }
}

window.customElements.define('bnb-assets-size-report', BnbAssetsSizeReport);
