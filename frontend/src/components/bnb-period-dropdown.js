import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-dropdown/iron-dropdown';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-material/paper-material';
import '@polymer/paper-menu-button/paper-menu-button';
import 'range-datepicker/range-datepicker';
import {
  addDays, addMonths, addWeeks, format, endOfDay, endOfMonth, endOfWeek,
  startOfDay, startOfMonth, startOfWeek,
} from 'date-fns';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updatePeriod } from '../actions/app';
import './bnb-common-styles';
import './bnb-icons';


class BnbPeriodDropdown extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      #startDate, #endDate {
        cursor: pointer;
      }

      paper-menu-button {
        margin-left: -0.5em;
        padding: 0;
      }
      paper-item {
        cursor: pointer;
      }

      paper-material {
        padding: 16px;
        display: block;
        background-color: var(--paper-card-background-color);
      }
    </style>

    <div class="layout horizontal end">
      <paper-input id="startDate" label="Date from" value="[[dateFrom]]" readonly on-tap="_handleOpenDropdown"></paper-input>
      <paper-input id="endDate" label="Date to" value="[[dateTo]]" readonly on-tap="_handleOpenDropdown"></paper-input>
      <iron-dropdown id="rangeDropdown" horizontal-align="[[horizontalAlign]]">
        <paper-material slot="dropdown-content">
          <range-datepicker date-from="{{startDate}}" date-to="{{endDate}}"></range-datepicker>
        </paper-material>
      </iron-dropdown>
      <paper-menu-button horizontal-align="right">
        <paper-icon-button icon="bnb:arrow-drop-down" slot="dropdown-trigger"></paper-icon-button>
        <paper-listbox slot="dropdown-content" attr-for-selected="data-period">
          <paper-item on-tap="_periodTapped" data-period="today">Today</paper-item>
          <paper-item on-tap="_periodTapped" data-period="this_week">This week</paper-item>
          <paper-item on-tap="_periodTapped" data-period="this_month">This&nbsp;month</paper-item>
          <paper-item on-tap="_periodTapped" data-period="yesterday">Yesterday</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_week">Last week</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_month">Last month</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_7_days">Last 7 days</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_30_days">Last 30 days</paper-item>
        </paper-listbox>
      </paper-menu-button>
    </div>
    `;
  }

  static get properties() {
    return {
      startDate: String,
      endDate: {
        type: String,
        notify: true,
        observer: '_endDateChanged',
      },
    };
  }

  _stateChanged(state) {
    this.dateFrom = format(new Date(state.app.period.start), 'MMM dd, yyyy');
    this.dateTo = format(new Date(state.app.period.end), 'MMM dd, yyyy');
  }

  _handleOpenDropdown() {
    this.$.rangeDropdown.open();
  }

  _endDateChanged(date) {
    if (date) {
      this.$.rangeDropdown.close();
      const period = {
        start: new Date(this.startDate),
        end: new Date(this.endDate),
      };
      store.dispatch(updatePeriod(period));
    }
  }

  _periodTapped(e) {
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
