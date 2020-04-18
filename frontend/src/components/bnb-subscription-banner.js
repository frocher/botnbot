import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-card/paper-button';
import '@polymer/paper-card/paper-card';
import './bnb-icons';

class BnbSubscriptionBanner extends extends PolymerElement {
  static get template() {
    return html`
    <style>
    </style>
    <paper-card placeholder-image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADwAQMAAABL4y8oAAAAA1BMVEW9vb2OR09dAAAAIElEQVR4Xu3AgQAAAADDoPtTX2EAtQAAAAAAAAAAAAAOJnAAAZexSsoAAAAASUVORK5CYII=" fade-image preload-image image="[[_computeScreenshotUrl(page)]]" animated="true" on-tap="cardTapped" class$="[[_computeCardClass(page)]]">
      <div class="card-content">
        <div class="subscription-icon">
          <iron-icon icon="bnb:error"></iron-icon>
        </div>
        <div class="subscription-text">[[text]]</div>
      </div>
      <div class="card-actions">
        <paper-button on-tap="_upgradeTapped">Upgrade subscription</paper-button>
      </div>
    </paper-card>
    `;
  }

  static get properties() {
    return {
      text: String,
    };
  }

  _upgradeTapped() {
    alert('todo');
  }
}

customElements.define('bnb-subscription-banner', BnbSubscriptionBanner);
