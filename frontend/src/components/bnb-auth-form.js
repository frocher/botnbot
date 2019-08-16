import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/paper-card/paper-card';
import './bnb-anchor';
import './bnb-common-styles';

class BnbAuthForm extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-fit;
        @apply --layout-vertical;
      }

      .auth-form {
        width: 70%;
        max-width: 380px;
        margin: 4em auto 1em auto;
        @apply --layout-self-center;
      }

      .links {
        width: 70%;
        max-width: 380px;
        margin: 0 auto;

        text-align: center;
        @apply --layout-self-center;
      }

      .card-content ::slotted(.actions) {
        position: relative;

        margin: 0;
        padding: 8px 8px 8px 24px;

        color: var(--paper-dialog-button-color);

        @apply --layout-horizontal;
        @apply --layout-end-justified;
      }
    </style>

    <paper-card id="auth" heading="[[title]]" class="auth-form">
      <div class="card-content">
        <slot></slot>
      </div>
    </paper-card>

    <div class="links">
      <div class="layout vertical">
        <template is="dom-repeat" items="{{buttons}}">
          <bnb-anchor text="{{item.text}}" path="{{item.path}}"></bnb-anchor>
        </template>
      </div>
    </div>
    `;
  }

  static get properties() {
    return {
      title: String,
      buttons: Array,
    };
  }
}

window.customElements.define('bnb-auth-form', BnbAuthForm);
