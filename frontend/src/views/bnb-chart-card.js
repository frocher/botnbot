import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import './bnb-card';
import './bnb-chart';
import './bnb-value-chip';

class BnbChartCard extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      data: { type: Array },
      model: { type: Array },
      type: { type: String },
      footer: { type: String },
      hasDetails: { type: Boolean },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
      margin: 16px;
    }

    bnb-card {
      width: 100%;
    }

    .card-header {
      font-size: 24px;
      margin-bottom: 16px;
    }

    #chips {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      text-align: center;
      align-items: stretch;
    }

    bnb-value-chip {
      flex: 1;
    }

    #chart {
      width: 100%;
      height: 340px;
    }
  `;
  }

  constructor() {
    super();
    this.name = '';
    this.data = [];
    this.model = [];
    this.type = 'line';
    this.hasDetails = false;
  }

  render() {
    return html`
    <bnb-card>
      <div class="card-header">${this.name}</div>
      <div class="card-content">
        <div id="chips">
          ${this.data?.map((i) => this.renderChip(i))}
        </div>
        <bnb-chart id="chart" type="${this.type}" footer="${this.footer}" .data="${this.data}" .model="${this.model}"></bnb-chart>
      </div>
      ${this.renderDetails()}
    </bnb-card>
    `;
  }

  renderChip(item) {
    return html`
      <bnb-value-chip text="${this.computeLabel(item)}" value="${item.summary}" suffix="${this.computeSuffix(item)}">
      </bnb-value-chip>
    `;
  }

  renderDetails() {
    return this.hasDetails
      ? html`
        <div class="card-actions" hidden$='[[!hasDetails]]'>
          <mwc-button id="detailsBtn" icon="toc" label="Details"></mwc-button>
        </div>`
      : html``;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('detailsBtn').addEventListener('click', () => this.detailsTapped());
  }

  computeLabel(o) {
    const item = this.model.find((i) => i.name === o.key);
    return item ? item.label : '';
  }

  computeSuffix(o) {
    const item = this.model.find((i) => i.name === o.key);
    return item && item.suffix ? item.suffix : '';
  }

  detailsTapped() {
    this.dispatchEvent(new CustomEvent('details'));
  }
}

customElements.define('bnb-chart-card', BnbChartCard);
