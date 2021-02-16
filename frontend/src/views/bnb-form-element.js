export const BnbFormElement = (baseElement) => class extends baseElement {
  /**
    * Validate or invalidate fields from an errors Array.
    * For lit elements
    */
  _litErrorsChanged() {
    if (this.errors) {
      for (let prop in this.errors) {
        if (this.errors.hasOwnProperty(prop)) {
          const obj = this.shadowRoot.getElementById(prop);
          if (obj) {
            obj.setCustomValidity(this.errors[prop][0]);
            obj.reportValidity();
          }
        }
      }
    }
  }

  validateFields(fields) {
    if (!this.shadowRoot) {
      return;
    }

    fields.forEach((id) => {
      const obj = this.shadowRoot.getElementById(id);
      if (obj) {
        obj.setCustomValidity('');
        obj.reportValidity();
      }
    });
  }
};
