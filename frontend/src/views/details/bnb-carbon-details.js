import { html, css } from 'lit';
import { BnbPageDetails } from './bnb-page-details';

class BnbCarbonDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`
      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(2):before {
          content: "co2";
        }

        table tbody tr td:nth-child(3):before {
          content: "ecoIndex";
        }

        table tbody tr td:nth-child(4):before {
          content: "bytes";
        }

        table tbody tr td:nth-child(5):before {
          content: "dom";
        }

        table tbody tr td:nth-child(6):before {
          content: "requests";
        }
      }
      `,
    ];
  }

  renderHeader() {
    return html`
      <tr>
        <th>date</th>
        <th>co2</th>
        <th>ecoIndex</th>
        <th>bytes</th>
        <th>dom</th>
        <th>requests</th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.time)}</td>
        <td>${item.co2_adjusted}</td>
        <td>${item.ecoindex_adjusted}</td>
        <td>${this.formatBytes(item.bytes_adjusted)}</td>
        <td>${item.elements_adjusted}</td>
        <td>${item.requests_adjusted}</td>
      </tr>
    `;
  }

  stateChanged(state) {
    super.stateChanged(state);
    if (state.stats.carbon_details) {
      this.details = state.stats.carbon_details.concat().sort((a, b) => this.sortDetails(a, b));
    } else {
      this.details = [];
    }
  }
}

window.customElements.define('bnb-carbon-details', BnbCarbonDetails);
