import { html, css } from 'lit-element';
import '@material/mwc-icon-button';
import { getRequestUrl } from '../common';
import { BnbPageDetails } from './bnb-page-details';

class BnbBytesDetails extends BnbPageDetails {
  static get styles() {
    return [
      super.styles,
      css`
      @media screen and (max-width: 820px) {
        table tbody tr td:nth-child(2):before {
          content: "html";
        }

        table tbody tr td:nth-child(3):before {
          content: "css";
        }

        table tbody tr td:nth-child(4):before {
          content: "javascript";
        }

        table tbody tr td:nth-child(5):before {
          content: "image";
        }

        table tbody tr td:nth-child(6):before {
          content: "font";
        }

        table tbody tr td:nth-child(7):before {
          content: "other";
        }

        table tbody tr td:nth-child(8):before {
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
        <th>html</th>
        <th>css</th>
        <th>javascript</th>
        <th>image</th>
        <th>font</th>
        <th>other</th>
        <th></th>
      </tr>
    `;
  }

  renderItem(item) {
    return html`
      <tr>
        <td>${this.formatTime(item.time)}</td>
        <td>${this.formatBytes(item.html_bytes)}</td>
        <td>${this.formatBytes(item.css_bytes)}</td>
        <td>${this.formatBytes(item.js_bytes)}</td>
        <td>${this.formatBytes(item.image_bytes)}</td>
        <td>${this.formatBytes(item.font_bytes)}</td>
        <td>${this.formatBytes(item.other_bytes)}</td>
        <td>
          <a href="${this.computeUrl(item.time_key)}" title="Show HAR" target="_blank">
            <mwc-icon-button icon="visibility"></mwc-icon-button>
          </a>
      </tr>
    `;
  }

  stateChanged(state) {
    super.stateChanged(state);
    if (state.stats.assets_details) {
      this.details = state.stats.assets_details.concat().sort( (a, b) => this.sortDetails(a,b));
    }
    else {
      this.details = [];
    }
  }

  computeUrl(key) {
    if (key) {
      let result = 'http://www.softwareishard.com/har/viewer/?inputUrl=';
      result += `${window.location.protocol}//${window.location.host}`;
      result += getRequestUrl(`pages/${this.page.id}/assets/${key}`);
      return result;
    }
    return '';
  }
}

window.customElements.define('bnb-bytes-details', BnbBytesDetails);
