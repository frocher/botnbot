import { html, css } from 'lit-element';
import '@material/mwc-icon-button';
import { getRequestUrl } from '../../utilities/api';
import { BnbPageDetails } from './bnb-page-details';

class BnbPerformanceDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`
      table thead tr th:nth-child(1n+2) {
        width: 130px;
        text-align: right;
      }

      table thead tr th:nth-child(6) {
        width: 60px;
        text-align: center;
      }

      table thead tr td:nth-child(6) {
        width: 60px;
        text-align: center;
      }

      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(2):before {
          content: "ttfb";
        }

        table tbody tr td:nth-child(3):before {
          content: "largest paint";
        }

        table tbody tr td:nth-child(4):before {
          content: "speed index";
        }

        table tbody tr td:nth-child(5):before {
          content: "total blocking time";
        }
        table tbody tr td:nth-child(6):before {
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
        <th><abbr title="Time To First Byte">ttfb</abbr></th>
        <th>largest paint</th>
        <th>speed index</th>
        <th><abbr title="Total Blocking Time">blocking time</abbr></th>
        <th></th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.time)}</td>
        <td>${this.formatNumber(item.ttfb)}</td>
        <td>${this.formatNumber(item.largest_contentful_paint)}</td>
        <td>${this.formatNumber(item.speed_index)}</td>
        <td>${this.formatNumber(item.total_blocking_time)}</td>
        <td>
          <a href="${this.computeUrl(item.time_key)}" title="Show HAR" target="_blank">
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

window.customElements.define('bnb-performance-details', BnbPerformanceDetails);
