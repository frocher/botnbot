import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon-button';
import { connect } from 'pwa-helpers';
import { format } from 'date-fns';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import './bnb-top-app-bar';

// eslint-disable-next-line import/prefer-default-export
export class BnbPageDetails extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: { type: Object },
      details: { type: Object },
    };
  }

  static get styles() {
    return css`
    #content {
      padding: 8px;
    }

    .table-wrap {
      overflow: auto;
      max-height: calc(100vh - 80px);
      margin: 0 auto;
      width: fit-content;
    }

    table {
      border-collapse: collapse;
      background: #fff;
      border-radius: 4px;
    }

    table thead tr {
      height: 60px;
      background: #212121;
      font-size: 16px;
      color: #fff;
      line-height: 1.2;
      font-weight: unset;
    }

    th {
      position: sticky;
      top: 0;
      z-index: 1
    }

    th:after {
      content: '';
      display: block;
      position: absolute;
      background-color: #212121;
      top: -1px;
      left:0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }

    table thead tr th:nth-child(1) {
      width: 140px;
      padding-left: 16px;
      text-align: left;
    }

    table thead tr th:nth-child(1n+2) {
      width: 95px;
      text-align: right;
    }

    table thead tr th:nth-child(8) {
      width: 60px;
      text-align: right;
    }

    table tbody {
      overflow: auto;
    }

    table tbody tr {
      height: 50px;
      font-size: 14px;
      color: gray;
      line-height: 1.2;
      font-weight: unset;
    }

    table tbody tr:nth-child(even) {
      background-color: #f5f5f5;
    }

    table tbody tr td:nth-child(1) {
      padding-left: 16px;
    }

    table tbody tr td:nth-child(1n+2) {
      text-align: right;
    }

    table tbody tr td:nth-child(8) {
      text-align: center;
    }

    a {
      color: rgba(0, 0, 0, var(--mdc-theme-on-primary));
    }


    @media screen and (max-width: 820px) {
      table {
        display: block;
      }

      table * {
        position: relative;
      }

      table>*, table tr, table td, table th {
        display: block;
      }

      table thead {
        display: none;
      }

      table tbody tr {
        height: auto;
        padding-top: 16px;
      }

      table tbody tr td {
        padding-left: 40% !important;
        margin-bottom: 24px;
      }

      table tbody tr td:before {
        display: block;
        position: absolute;
        font-size: 14px;
        color: #999;
        line-height: 1.2;
        font-weight: unset;
        width: 40%;
        left: 30px;
        top: 0;
      }

      table tbody tr td:nth-child(1):before {
        content: "date";
      }

      table tbody tr td:nth-child(1n) {
        text-align: left ! important;
        width: calc(100vw - 16px);
      }

    }
    `;
  }

  render() {
    return html`
    <bnb-top-app-bar>
      <mwc-icon-button id="backBtn" icon="arrow_back" slot="navigationIcon"></mwc-icon-button>
      <div slot="title">${this.page ? this.page.name : ''}</div>

      <div id="content">
        <div class="table-wrap">
        <table>
          <thead>
            ${this.renderHeader()}
          </thead>
          <tbody>
            ${this.details.map((i) => this.renderItem(i))}
          </tbody>
        </table>
        </div>
      </div>
    </bnb-top-app-bar>
    `;
  }

  renderHeader() {
    return html`
    `;
  }

  renderItem(item) {
    return html`${item}`;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('backBtn').addEventListener('click', () => this.backTapped());
  }

  stateChanged(state) {
    this.page = state.pages.current;
  }

  sortDetails(a, b) {
    return a.time > b.time ? -1 : 1;
  }

  backTapped() {
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  formatTime(time) {
    return format(new Date(time), 'MMM dd, yyyy HH:mm');
  }

  formatBytes(bytes) {
    return `${Math.round(bytes / 1024).toLocaleString()} kb`;
  }

  formatNumber(x) {
    return x ? x.toLocaleString() : '';
  }
}
