export const BnbFormElement = (baseElement) => class extends baseElement {
  /**
    * Validate or invalidate fields from an errors Array
    */
  _errorsChanged() {
    if (this.errors) {
      for (let prop in this.errors) {
        if (this.errors.hasOwnProperty(prop)) {
          let objId = prop;
          if (this.$[objId] !== undefined) {
            this.$[objId].invalid = true;
            this.$[objId].errorMessage = this.errors[prop][0];
          }
        }
      }
    }
  }

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
};
