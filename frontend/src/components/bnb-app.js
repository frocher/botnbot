import '@material/mwc-snackbar';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { connect } from 'pwa-helpers';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/iron-pages/iron-pages';
import { store } from '../store';
import { updateRoute, loadEnvironment, loadSubscriptionPlans, showInstallPrompt } from '../actions/app';
import { loadBudgets } from '../actions/budgets';
import { loadPageMembers } from '../actions/members';
import { loadPages, loadPage } from '../actions/pages';
import { loadPageStats, loadLighthouseDetails, loadAssetsDetails, loadUptimeDetails } from '../actions/stats';
import { loadStripeSubscription, loadUser } from '../actions/account';
import { isLogged, storeCredentials } from '../common';
import './bnb-analytics';
import './bnb-common-styles';
import './bnb-home';
import './bnb-signin';

class BnbApp extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        --dark-primary-color: #000000;
        --default-primary-color:var(--paper-grey-900);
        --light-primary-color: #303030;
        --text-primary-color: #ffffff;
        --accent-color: #FF5722;
        --primary-background-color: #303030;
        --primary-text-color: #ffffff;
        --secondary-text-color: var(--paper-grey-300);
        --disabled-text-color: #bdbdbd;
        --divider-color: #B6B6B6;
        --error-color: #db4437;

        --mdc-theme-primary: #212121;
        --mdc-theme-secondary: var(--google-blue-300);
        --mdc-theme-surface: #000;
        --mdc-theme-background: #303030;

        --mdc-theme-on-primary: #fff;
        --mdc-theme-on-secondary: var(--paper-grey-900);
        --mdc-theme-on-surface: var(--paper-grey-900);

        --mdc-theme-error: #cf6679;
        --mdc-theme-text-primary-on-background: #ffffff;
        --mdc-theme-text-secondary-on-background: #ffffff;
        --mdc-theme-text-disabled-on-background: var(--paper-grey-900);

        --mdc-dialog-heading-ink-color: var(--mdc-theme-text-primary-on-background);
        --mdc-dialog-content-ink-color: var(--mdc-theme-text-primary-on-background);
        --mdc-radio-unchecked-color: var(--mdc-theme-text-primary-on-background);
        --mdc-text-field-outlined-hover-border-color: var(--mdc-theme-primary);
        --mdc-text-field-label-ink-color: var(--mdc-theme-text-primary-on-background);
        --mdc-text-field-ink-color: var(--mdc-theme-text-primary-on-background);
        --mdc-text-field-outlined-idle-border-color: var(--mdc-theme-text-primary-on-background);


        --paper-card-background-color: var(--paper-grey-800);
        --paper-card-header-color: var(--text-primary-color);
        --paper-dialog-button-color: var(--google-blue-300);
        --paper-divider-color: #B6B6B6;
        --paper-input-container-color: var(--secondary-text-color);
        --paper-input-container-focus-color: var(--google-blue-300);
        --paper-radio-button-checked-color: var(--google-blue-300);
        --paper-tabs-selection-bar-color: var(--google-blue-300);

        --range-datepicker-cell-hover: var(--google-blue-300);
        --range-datepicker-cell-selected: var(--google-blue-300);
        --range-datepicker-cell-hovered: var(--google-blue-500);

        --app-nav-background-color: var(--primary-background-color);
        --app-nav-text-color: var(--secondary-text-color);

        background-color: var(--primary-background-color);
        @apply --layout-fit;
        @apply --layout-vertical;
      }

      .view {
        @apply --layout-fit;
      }
    </style>

    <app-location route="{{route}}"></app-location>
    <app-route
        route="{{route}}"
        pattern="/:page"
        data="{{routeData}}"
        tail="{{subroute}}"></app-route>

    <bnb-analytics id="analytics" key="[[analyticsKey]]"></bnb-analytics>

    <iron-pages
        class="view"
        selected="[[view]]"
        attr-for-selected="name"
        selected-attribute="visible"
        fallback-selection="404">
      <bnb-add-page            name="add-page"            class="view"></bnb-add-page>
      <bnb-bytes-details       name="bytes-details"       class="view"></bnb-bytes-details>
      <bnb-home                name="home"                class="view"></bnb-home>
      <bnb-members             name="members"             class="view"></bnb-members>
      <bnb-edit-page           name="edit-page"           class="view"></bnb-edit-page>
      <bnb-edit-password       name="edit-password"       class="view"></bnb-edit-password>
      <bnb-forgot-password     name="forgot-password"     class="view"></bnb-forgot-password>
      <bnb-lighthouse-details  name="lighthouse-details"  class="view"></bnb-lighthouse-details>
      <bnb-page                name="page"                class="view"></bnb-page>
      <bnb-performance-details name="performance-details" class="view"></bnb-performance-details>
      <bnb-requests-details    name="requests-details"    class="view"></bnb-requests-details>
      <bnb-signin              name="signin"              class="view"></bnb-signin>
      <bnb-signup              name="signup"              class="view"></bnb-signup>
      <bnb-uptime-details      name="uptime-details"      class="view"></bnb-uptime-details>
      <bnb-account             name="account"             class="view"></bnb-account>
      <bnb-404-warning         name="404"                 class="view"></bnb-404-warning>
    </iron-pages>

    <mwc-snackbar id="messageSnack"></mwc-snackbar>
    `;
  }

  static get properties() {
    return {
      routePath: {
        type: String,
        reflectToAttribute: true,
        observer: '_routePathChanged',
      },

      view: {
        type: String,
        reflectToAttribute: true,
        observer: '_viewChanged',
      },

      message: {
        type: Object,
        observer: '_messageChanged',
      },

      analyticsKey: {
        type: String,
      },

      page: {
        type: Object,
      },

      page_stats: {
        type: Object,
      },

      period: {
        type: Object,
        observer: '_periodChanged',
      },

      offline: {
        type: Boolean,
        value: false,
        readOnly: true,
      },
    };
  }

  static get observers() {
    return ['_routeViewChanged(routeData.page)'];
  }

  _stateChanged(state) {
    this.routePath = state.app.route;
    this.message = state.app.message;
    this.analyticsKey = state.app.analyticsKey;
    this.page = state.pages.current;
    this.page_stats = state.stats.all;
    this.period = state.app.period;
  }

  ready() {
    super.ready();
    this.removeAttribute('unresolved');
    store.dispatch(loadEnvironment());
    store.dispatch(loadSubscriptionPlans());
    this.scrollPositions = new Map();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      store.dispatch(showInstallPrompt(e));
    });

    // listen for online/offline
    afterNextRender(this, () => {
      window.addEventListener('online', e => this._notifyNetworkStatus(e));
      window.addEventListener('offline', e => this._notifyNetworkStatus(e));
    });
  }

  _routePathChanged(path) {
    // Store view scroll position
    if (this.scrollPositions) {
      this.scrollPositions.set(this.route.path, window.scrollY);
    }

    window.history.pushState({}, null, `/${path}`);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  _routeViewChanged(view) {
    // Check if we find credentials in parameters (used for omniauth)
    // if true : store credentials and remove them from the query string
    if (this._getUrlParameter('auth_token')) {
      storeCredentials(this._getUrlParameter('auth_token'), this._getUrlParameter('uid'), this._getUrlParameter('client_id'));
      this._removeParameters();
    }

    if (view !== 'signin' && view !== 'signup' && view !== 'forgot-password' && view !== 'edit-password') {
      if (!isLogged()) {
        store.dispatch(updateRoute('signin'));
      }
    }
    this.view = view || 'home';
  }

  _viewChanged(view, oldView) {
    if (view !== null) {
      // home and signin route are eagerly loaded
      if (view === 'home' || view === 'signin') {
        this._viewLoaded(Boolean(oldView));
      // other routes are lazy loaded
      } else {
        // When a load failed, it triggered a 404 which means we need to
        // eagerly load the 404 page definition
        const cb = this._viewLoaded.bind(this, Boolean(oldView));

        switch (view) {
          case 'add-page':
            import('./bnb-add-page.js').then(cb);
            break;
          case 'bytes-details':
            import('./bnb-bytes-details.js').then(cb);
            break;
          case 'edit-page':
            import('./bnb-edit-page.js').then(cb);
            break;
          case 'edit-password':
            import('./bnb-edit-password.js').then(cb);
            break;
          case 'forgot-password':
            import('./bnb-forgot-password.js').then(cb);
            break;
          case 'lighthouse-details':
            import('./bnb-lighthouse-details.js').then(cb);
            break;
          case 'members':
            import('./bnb-members.js').then(cb);
            break;
          case 'page':
            import('./bnb-page.js').then(cb);
            break;
          case 'performance-details':
            import('./bnb-performance-details.js').then(cb);
            break;
          case 'requests-details':
            import('./bnb-requests-details.js').then(cb);
            break;
          case 'signup':
            import('./bnb-signup.js').then(cb);
            break;
          case 'uptime-details':
            import('./bnb-uptime-details.js').then(cb);
            break;
          case 'account':
            import('./bnb-account.js').then(cb);
            break;
          default:
            this._viewLoaded(Boolean(oldView));
        }
      }

      // Restore scroll position
      if (this.scrollPositions && this.scrollPositions.has(this.route.path)) {
        window.scroll(0, this.scrollPositions.get(this.route.path));
      } else {
        window.scroll(0, 0);
      }
    }
  }

  _viewLoaded() {
    this._ensureLazyLoaded();
    this.$.analytics.sendPath(this.route.path);

    if (isLogged()) {
      this._loadCurrentViewData();
    }
  }

  _loadCurrentViewData() {
    if (store && !store.getState().app.stripeSubscription && isLogged()) {
      store.dispatch(loadStripeSubscription());
    }
    if (this.view === 'home') {
      store.dispatch(loadPages());
    } else if (this.view === 'account') {
      store.dispatch(loadUser());
    } else if (this.view === 'page') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadPageStats(pageId, this.period));
      store.dispatch(loadBudgets(pageId, this.period));
    } else if (this.view === 'edit-page') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
    } else if (this.view === 'members') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadPageMembers(pageId));
    } else if (this.view === 'lighthouse-details' || this.view === 'performance-details') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadLighthouseDetails(pageId, this.period));
    } else if (this.view === 'uptime-details') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadUptimeDetails(pageId, this.period));
    } else if (this.view === 'requests-details' || this.view === 'bytes-details') {
      const pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadAssetsDetails(pageId, this.period));
    }
  }

  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      afterNextRender(this, () => {
        import('./lazy-resources.js').then(async () => {
          this._notifyNetworkStatus();
          this.loadComplete = true;
        });
      });
    }
  }

  _notifyNetworkStatus() {
    const oldOffline = this.offline;
    this._setOffline(!window.navigator.onLine);
    // Show the snackbar if the user is offline when starting a new session
    // or if the network status changed.
    if (this.offline || (!this.offline && oldOffline === true)) {
      if (!this._networkSnackbar) {
        this._networkSnackbar = document.createElement('bnb-snackbar');
        this.root.appendChild(this._networkSnackbar);
      }
      this._networkSnackbar.textContent = this.offline
        ? 'You are offline' : 'You are online';
      this._networkSnackbar.open();
    }
  }

  _messageChanged(newVal) {
    if (newVal && newVal.text) {
      this.$.messageSnack.labelText = newVal.text;
      this.$.messageSnack.leading = window.innerWidth > 800;
      this.$.messageSnack.open();
    }
  }

  _periodChanged() {
    this._loadCurrentViewData();
  }

  _getUrlParameter(name) {
    const replaced = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${replaced}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Remove all query string from the url (and hash too)
   */
  _removeParameters() {
    const newLocation = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    window.history.pushState('', document.title, newLocation);
  }
}

customElements.define('bnb-app', BnbApp);
