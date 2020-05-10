import { TopAppBarFixed } from '@material/mwc-top-app-bar-fixed';
import { css } from 'lit-element';

// eslint-disable-next-line import/prefer-default-export
export class BnbTopAppBar extends TopAppBarFixed {
  static get styles() {
    return [
      super.styles,
      css`
      :host {
        --mdc-theme-primary: #212121;
        --mdc-theme-on-primary: #fff;
      }

      ::slotted(mwc-button) {
        --mdc-theme-primary: white;
      }
      `,
    ];
  }
}

customElements.define('bnb-top-app-bar', BnbTopAppBar);
