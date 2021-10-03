import { html, css } from 'lit';
import formatDistance from 'date-fns/formatDistance';
import '@material/mwc-icon-button';
import { getRequestUrl } from '../../utilities/api';
import { BnbPageDetails } from './bnb-page-details';

class BnbUptimeDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`

      table thead tr th:nth-child(2) {
        width: 140px;
        padding-left: 16px;
        text-align: left;
      }

      table thead tr th:nth-child(3) {
        width: 100px;
        text-align: left;
      }

      table thead tr th:nth-child(4) {
        width: 80px;
        text-align: center;
      }

      table thead tr th:nth-child(5) {
        width: 500px;
        padding-left: 16px;
        text-align: left;
      }

      table tbody tr td:nth-child(2) {
        width: 140px;
        text-align: left;
      }

      table tbody tr td:nth-child(3) {
        width: 100px;
        text-align: left;
      }

      table tbody tr td:nth-child(4) {
        width: 80px;
        text-align: center;
      }

      table tbody tr td:nth-child(5) {
        width: 500px;
        padding-left: 16px;
        text-align: left;
      }

      .down {
        width: 60px;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        margin: 0 auto;
        padding: 4px;
        background-color: var(--mdc-theme-error);
      }

      .up {
        width: 60px;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        margin: 0 auto;
        padding: 4px;
        background-color: var(--mdc-theme-success);
      }

      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(3):before {
          content: "duration";
        }

        table tbody tr td:nth-child(4):before {
          content: "status";
        }

        table tbody tr td:nth-child(5):before {
          content: "message";
        }

        table tbody tr td:nth-child(6):before {
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
        <th>from</th>
        <th>to</th>
        <th>duration</th>
        <th>status</th>
        <th>message</th>
        <th></th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.from)}</td>
        <td>${this.formatTime(item.to)}</td>
        <td>${this.formatDuration(item.from, item.to)}</td>
        <td>
          <div class="${this.statusClass(item.value)}">
            ${this.formatStatus(item.value)}
          </div>
        </td>
        <td>${item.errorMessage}</td>
        <td>${this.renderIconButton(item)}</td>
      </tr>
    `;
  }

  renderIconButton(item) {
    if (!item.timeKey) {
      return html``;
    }

    return html`
      <a href="${this.computeUrl(item.timeKey)}" title="Show content" target="_blank">
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
    this.details = this.processDetails(this.details);
  }

  processDetails(details) {
    let to = new Date();
    const resu = [];
    let from = null;
    let lastValue = null;
    let lastErrorCode = null;
    let lastErrorMessage = null;
    let lastTimeKey = null;
    details.forEach((detail) => {
      const { value } = detail;
      if (lastValue === null) {
        lastValue = value;
        lastErrorCode = detail.error_code;
        lastErrorMessage = detail.error_message;
        lastTimeKey = detail.time_key;
      } else if (lastValue !== value || lastErrorCode !== detail.error_code
         || lastErrorMessage !== detail.error_message) {
        resu.push({
          from,
          to,
          value: lastValue,
          errorCode: lastErrorCode,
          errorMessage: lastErrorMessage,
          timeKey: lastTimeKey,
        });

        to = from;
        lastValue = value;
        lastErrorCode = detail.error_code;
        lastErrorMessage = detail.error_message;
        lastTimeKey = detail.time_key;
      }

      from = new Date(detail.time);
    });

    if (from !== null) {
      resu.push({
        from,
        to,
        value: lastValue,
        errorCode: lastErrorCode,
        errorMessage: lastErrorMessage,
        timeKey: lastTimeKey,
      });
    }

    return resu;
  }

  statusClass(value) {
    return value === 0 ? 'down' : 'up';
  }

  formatDuration(from, to) {
    return formatDistance(new Date(from), new Date(to));
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
