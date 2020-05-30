import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '@material/mwc-textfield';
import 'wc-range-datepicker/dist/wc-range-datepicker';
import {
  addDays, addMonths, addWeeks, format, endOfDay, endOfMonth, endOfWeek,
  startOfDay, startOfMonth, startOfWeek,
} from 'date-fns';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updatePeriod } from '../actions/app';


class BnbPeriodDropdown extends connect(store)(LitElement) {
  static get properties() {
    return {
      startDate: { type: String },
      endDate: { type: String },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
      position: relative;
      flex-direction: row;
      align-items: flex-end;
    }

    #startDate {
      margin-right: 8px;
    }
    `;
  }

  render() {
    return html`
    <mwc-textfield id="startDate" label="Date from" outlined value="${this.startDate}" readonly @click="${this.dateClicked}"></mwc-textfield>
    <mwc-textfield id="endDate" label="Date to" outlined value="${this.endDate}" readonly @click="${this.dateClicked}"></mwc-textfield>
    <mwc-menu id="rangeMenu">
      <wc-range-datepicker id="datePicker" @date-to-changed="${this.dateToChanged}"></wc-range-datepicker>
    </mwc-menu>

    <div style="position:relative">
      <mwc-icon-button id="moreDateBtn" icon="more_vert" @click="${this.moreDateClicked}"></mwc-icon-button>
      <mwc-menu id="moreDateMenu">
        <mwc-list-item @click="${this.periodTapped}" data-period="today">Today</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="this_week">This week</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="this_month">This&nbsp;month</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="yesterday">Yesterday</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="last_week">Last week</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="last_month">Last month</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="last_7_days">Last 7 days</mwc-list-item>
        <mwc-list-item @click="${this.periodTapped}" data-period="last_30_days">Last 30 days</mwc-list-item>
      </mwc-menu>
    </div>
    `;
  }

  stateChanged(state) {
    this.startDate = format(new Date(state.app.period.start), 'MMM dd, yyyy');
    this.endDate = format(new Date(state.app.period.end), 'MMM dd, yyyy');
  }

  dateClicked() {
    const picker = this.shadowRoot.getElementById('datePicker');
    picker.dateFrom = undefined;
    picker.dateTo = undefined;
    this.shadowRoot.getElementById('rangeMenu').show();
  }

  moreDateClicked() {
    this.shadowRoot.getElementById('moreDateMenu').show();
  }

  dateToChanged() {
    const picker = this.shadowRoot.getElementById('datePicker');
    if (picker.dateTo) {
      this.shadowRoot.getElementById('rangeMenu').close();
      const period = {
        start: new Date(picker.dateFrom * 1000),
        end: new Date(picker.dateTo * 1000),
      };
      store.dispatch(updatePeriod(period));
    }
  }

  periodTapped(e) {
    const type = e.currentTarget.dataset.period;
    let startDate;
    let endDate;
    const now = new Date();
    switch (type) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'this_week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'yesterday':
        startDate = startOfDay(addDays(now, -1));
        endDate = endOfDay(addDays(now, -1));
        break;
      case 'last_week':
        startDate = startOfWeek(addWeeks(now, -1));
        endDate = endOfWeek(addWeeks(now, -1));
        break;
      case 'last_month':
        startDate = startOfMonth(addMonths(now, -1));
        endDate = endOfMonth(addMonths(now, -1));
        break;
      case 'last_7_days':
        startDate = startOfDay(addDays(now, -7));
        endDate = endOfDay(now);
        break;
      case 'last_30_days':
        startDate = startOfDay(addDays(now, -30));
        endDate = endOfDay(now);
        break;
    }
    store.dispatch(updatePeriod({ start: startDate, end: endDate }));
  }
}
window.customElements.define('bnb-period-dropdown', BnbPeriodDropdown);
