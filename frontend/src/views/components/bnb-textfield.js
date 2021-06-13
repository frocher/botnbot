import { TextField } from '@material/mwc-textfield/mwc-textfield';

class BnbTextField extends TextField {
  handleInputChange() {
    super.handleInputChange();
    const fieldValue = this.value;
    this.dispatchEvent(new CustomEvent('change', { fieldValue }));
  }
}

customElements.define('bnb-textfield', BnbTextField);
