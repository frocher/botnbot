import { html, css } from 'lit-element';
import '@material/mwc-icon-button';
import { getRequestUrl } from '../utilities/api';
import { BnbPageDetails } from './bnb-page-details';

class BnbLighthouseDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`
      table thead tr th:nth-child(1n+2) {
        width: 120px;
        text-align: right;
      }

      table thead tr th:nth-child(7) {
        width: 60px;
        text-align: center;
      }

      table thead tr td:nth-child(7) {
        width: 60px;
        text-align: center;
      }

      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(2):before {
          content: "pwa";
        }

        table tbody tr td:nth-child(3):before {
          content: "performance";
        }

        table tbody tr td:nth-child(4):before {
          content: "accessibility";
        }

        table tbody tr td:nth-child(5):before {
          content: "best practices";
        }

        table tbody tr td:nth-child(6):before {
          content: "seo";
        }

        table tbody tr td:nth-child(7):before {
          content: "open report";
        }

        a mwc-icon-button {
          margin-left: -16px;
          margin-top: -16px;
        }
      }
      `,
    ];
  }

  renderHeader() {
    return html`
      <tr>
        <th>date</th>
        <th>pwa</th>
        <th>performance</th>
        <th>accessibility</th>
        <th>best practices</th>
        <th>seo</th>
        <th></th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.time)}</td>
        <td>${this.formatNumber(item.pwa)}</td>
        <td>${this.formatNumber(item.performance)}</td>
        <td>${this.formatNumber(item.accessibility)}</td>
        <td>${this.formatNumber(item.best_practices)}</td>
        <td>${this.formatNumber(item.seo)}</td>
        <td>
          <a href="${this.computeUrl(item.time_key)}" title="Show lighthouse report" target="_blank">
            <mwc-icon-button icon="visibility"></mwc-icon-button>
          </a>
      </tr>
    `;
  }

  stateChanged(state) {
    super.stateChanged(state);
    if (state.stats.lighthouse_details) {
      this.details = state.stats.lighthouse_details.concat().sort((a, b) => this.sortDetails(a, b));
    } else {
      this.details = [];
    }
  }

  computeUrl(key) {
    if (key) {
      return getRequestUrl(`pages/${this.page.id}/lighthouse/${key}#performance`);
    }
    return '';
  }
}

window.customElements.define('bnb-lighthouse-details', BnbLighthouseDetails);
