import { html, css } from 'lit-element';
import '@material/mwc-icon-button';
import { getRequestUrl } from '../common';
import { BnbPageDetails } from './bnb-page-details';

class BnbUptimeDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`
      table thead tr th:nth-child(2) {
        width: 80px;
        text-align: center;
      }

      table thead tr th:nth-child(3) {
        width: 500px;
        padding-left: 16px;
        text-align: left;
      }

      table tbody tr td:nth-child(2) {
        width: 80px;
        text-align: center;
      }

      table tbody tr td:nth-child(3) {
        width: 500px;
        padding-left: 16px;
        text-align: left;
      }

      .down {
        width: 60px;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        padding: 4px;
        background-color: #B71C1C;
      }

      .up {
        width: 60px;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        padding: 4px;
        background-color: #1B5E20;
      }

      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(2):before {
          content: "status";
        }

        table tbody tr td:nth-child(3):before {
          content: "message";
        }

        table tbody tr td:nth-child(4):before {
          content: "open report";
        }

        td mwc-icon-button {
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
        <th>status</th>
        <th>message</th>
        <th></th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.time)}</td>
        <td>
          <div class="${this.statusClass(item.value)}">
            ${this.formatStatus(item.value)}
          </div>
        </td>
        <td>${item.error_message}</td>
        <td>${this.renderIconButton(item)}</td>
      </tr>
    `;
  }

  renderIconButton(item) {
    if (!item.key) {
      return html`
        <mwc-icon-button disabled icon="visibility"></mwc-icon-button>
      `;
    }

    return html`
      <a href="${this.computeUrl(item.time_key)}" title="Show content" target="_blank">
        <mwc-icon-button icon="visibility"></mwc-icon-button>
      </a>
    `;
  }

  stateChanged(state) {
    super.stateChanged(state);
    if (state.stats.uptime_details) {
      this.details = state.stats.uptime_details.concat().sort((a, b) => this.sortDetails(a, b));
    } else {
      this.details = [];
    }
  }

  statusClass(value) {
    return value === 0 ? 'down' : 'up';
  }

  formatStatus(value) {
    return value === 0 ? 'Down' : 'Up';
  }

  computeUrl(key) {
    if (key) {
      return getRequestUrl(`pages/${this.page.id}/uptime/${key}`);
    }
    return '';
  }
}

window.customElements.define('bnb-uptime-details', BnbUptimeDetails);
