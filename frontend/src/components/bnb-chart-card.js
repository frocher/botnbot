import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-tabs/paper-tabs';
import './bnb-chart';
import './bnb-value-chip';

class BnbChartCard extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        margin: 16px;
      }

      paper-card {
        width: 100%;
      }

      #chips {
        text-align: center;
        align-items: stretch;
        @apply --layout-horizontal;
        @apply --layout-wrap;
      }

      bnb-value-chip {
        flex: 1;
      }

      #chart {
        width: 100%;
        height: 340px;
      }
    </style>

    <paper-card heading="[[name]]">
      <div class="card-content">
        <div id="chips">
          <template is="dom-repeat" id="values" items="[[data]]">
            <bnb-value-chip text="[[computeLabel(item)]]" value="[[item.summary]]" suffix="[[computeSuffix(item)]]">
            </bnb-value-chip>
          </template>
        </div>
        <bnb-chart id="chart" type="[[type]]" data="[[data]]" model="[[model]]"></bnb-chart>
      </div>
      <div class="card-actions" hidden$='[[!hasDetails]]'>
        <paper-button on-tap="_detailsTapped"><iron-icon icon="bnb:toc"></iron-icon>Details</paper-button>
      </div>
    </paper-card>
    `;
  }

  static get properties() {
    return {
      name: {
        type: String,
        value: '',
      },
      data: {
        type: Array,
        value() {
          return [];
        },
      },
      model: {
        type: Array,
        value() {
          return [];
        },
      },
      type: {
        type: String,
        value: 'line',
      },
      hasDetails: {
        type: Boolean,
        value: false,
      },
    };
  }

  ready() {
    super.ready();
  }

  computeLabel(o) {
    const item = this.model.find(i => i.name === o.key);
    if (item) {
      return item.label;
    }
    return '';
  }

  computeSuffix(o) {
    const item = this.model.find(i => i.name === o.key);
    if (item) {
      return item.suffix;
    }
    return '';
  }

  _detailsTapped() {
    this.dispatchEvent(new CustomEvent('details'));
  }
}
customElements.define('bnb-chart-card', BnbChartCard);
