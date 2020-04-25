import { LitElement, css, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import '@material/mwc-snackbar';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute, loadEnvironment, loadSubscriptionPlans, showInstallPrompt } from '../actions/app';
import { loadBudgets } from '../actions/budgets';
import { loadPageMembers } from '../actions/members';
import { loadPages, loadPage } from '../actions/pages';
import { loadPageStats, loadLighthouseDetails, loadAssetsDetails, loadUptimeDetails } from '../actions/stats';
import { loadStripeSubscription, loadUser } from '../actions/account';
import { isLogged, storeCredentials, getFullPath } from '../common';
import Router from 'navigo';
import './bnb-analytics';
import './bnb-common-styles';
import './bnb-home';
import './bnb-signin';


class BnbApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      analyticsKey: { type: String },
      message: { type: Object },
      offline: { type: Boolean },
      params: { type: Object },
      period: { type: Object },
      route: { type: String },
      view: { type: String },
    };
  }

  static get styles() {
    return css`
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

      --mdc-theme-primary: var(--google-blue-300);
      --mdc-theme-secondary: var(--google-blue-300);
      --mdc-theme-surface: #000;
      --mdc-theme-background: #303030;

      --mdc-theme-on-primary: #212121;
      --mdc-theme-on-secondary: var(--paper-grey-900);
      --mdc-theme-on-surface: var(--paper-grey-900);

      --mdc-theme-error: #cf6679;
      --mdc-theme-text-primary-on-background: #ffffff;
      --mdc-theme-text-secondary-on-background: #ffffff;
      --mdc-theme-text-disabled-on-background: var(--paper-grey-900);

      --mdc-dialog-heading-ink-color: var(--mdc-theme-text-primary-on-background);
      --mdc-dialog-content-ink-color: var(--mdc-theme-text-primary-on-background);
      --mdc-radio-unchecked-color: var(--mdc-theme-text-primary-on-background);
      --mdc-text-field-label-ink-color: var(--mdc-theme-text-primary-on-background);
      --mdc-text-field-ink-color: var(--mdc-theme-text-primary-on-background);
      --mdc-text-field-outlined-idle-border-color: var(--mdc-theme-text-primary-on-background);
      --mdc-text-field-outlined-hover-border-color: var(--mdc-theme-secondary);


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

      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: var(--primary-background-color);

      mwc-button {
        --mdc-theme-primary: var(--google-blue-300);
      }

    }


    .view {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .view.active {
      display: block;
    }

    `;


  }

  constructor() {
    super();
    this.initRouter();
    this.scrollPositions = new Map();
  }

  render() {
    return html`
    <bnb-analytics id="analytics" key="${this.analyticsKey}"></bnb-analytics>

    <bnb-add-page            class=${classMap(this.renderClass('add-page'))}></bnb-add-page>
    <bnb-account             class=${classMap(this.renderClass('ccount'))}></bnb-account>
    <bnb-bytes-details       class=${classMap(this.renderClass('bytes-details'))}></bnb-bytes-details>
    <bnb-home                class=${classMap(this.renderClass('home'))}></bnb-home>
    <bnb-members             class=${classMap(this.renderClass('members'))}></bnb-members>
    <bnb-edit-page           class=${classMap(this.renderClass('edit-page'))}></bnb-edit-page>
    <bnb-edit-password       class=${classMap(this.renderClass('edit-password'))}></bnb-edit-password>
    <bnb-forgot-password     class=${classMap(this.renderClass('forgot-password'))}></bnb-forgot-password>
    <bnb-lighthouse-details  class=${classMap(this.renderClass('lighthouse-details'))}></bnb-lighthouse-details>
    <bnb-page                class=${classMap(this.renderClass('page'))}></bnb-page>
    <bnb-performance-details class=${classMap(this.renderClass('performance-details'))}></bnb-performance-details>
    <bnb-requests-details    class=${classMap(this.renderClass('requests-details'))}></bnb-requests-details>
    <bnb-signin              class=${classMap(this.renderClass('signin'))}></bnb-signin>
    <bnb-signup              class=${classMap(this.renderClass('signup'))}></bnb-signup>
    <bnb-uptime-details      class=${classMap(this.renderClass('uptime-details'))}></bnb-uptime-details>
    <bnb-404-warning         class=${classMap(this.renderClass('404-warning'))}></bnb-404-warning>

    <mwc-snackbar id="messageSnack"></mwc-snackbar>
    `;
  }

  renderClass(name) {
    return name === this.view ? { view: true, active: true } : { view: true }
  }

  renderCurrentView() {
    const views = {
      'add-page' : html`<bnb-add-page class="view"></bnb-add-page>`,
      'account'  : html`<bnb-account class="view"></bnb-account>`,
      'bytes-details' : html`<bnb-bytes-details class="view"></bnb-bytes-details>`,
      'home' : html`<bnb-home class="view"></bnb-home>`,
      'members' : html`<bnb-members class="view"></bnb-members>`,
      'edit-page' : html`<bnb-edit-page class="view"></bnb-edit-page>`,
      'edit-password' : html`<bnb-edit-password class="view"></bnb-edit-password>`,
      'forgot-password' : html`<bnb-forgot-password class="view"></bnb-forgot-password>`,
      'lighthouse-details' : html`<bnb-lighthouse-details class="view"></bnb-lighthouse-details>`,
      'page' : html`<bnb-page class="view"></bnb-page>`,
      'performance-details' : html`<bnb-performance-details class="view"></bnb-performance-details>`,
      'requests-details' : html`<bnb-requests-details class="view"></bnb-requests-details>`,
      'signin' : html`<bnb-signin class="view"></bnb-signin>`,
      'signup' : html`<bnb-signup class="view"></bnb-signup>`,
      'uptime-details' : html`<bnb-uptime-details class="view"></bnb-uptime-details>`,
    };

    let result = views[this.view];
    if (!result) {
      html`<bnb-404-warning class="view"></bnb-404-warning>`;
    }

    return result;
  }

  stateChanged(state) {
    this.analyticsKey = state.app.analyticsKey;
    if (this.route !== state.app.route) {
      this.scrollPositions.set(this.route, window.scrollY);
      this.route = state.app.route;
      this.router.navigate(`/${this.route}`);
    }
    if (this.message !== state.app.message) {
      this.message = state.app.message;
      this.showMessageSnack(this.message);
    }
    if (this.period !== state.app.period) {
      this.period = state.app.period;
      this.loadCurrentViewData();
    }
  }

  initRouter() {
    this.router = new Router(getFullPath(''));

    this.router.on({
      '/add-page' : () => {
        this.updateView('add-page');
      },
      '/account' : () => {
        this.updateView('account');
      },
      '/bytes-details/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('bytes-details');
      },
      '/edit-page/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('edit-page');
      },
      '/edit-password' : () => {
        this.updateView('edit-password');
      },
      '/forgot-password' : () => {
        this.updateView('forgot-password');
      },
      '/home' : () => {
        this.updateView('home');
      },
      '/lighthouse-details/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('lighthouse-details');
      },
      '/members/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('members');
      },
      '/page/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('page');
      },
      '/performance-details/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('performance-details');
      },
      '/requests-details/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('requests-details');
      },
      '/signin' : () => {
        this.updateView('signin');
      },
      '/signup' : () => {
        this.updateView('signup');
      },
      '/uptime-details/:id' : (params) => {
        this.pageId = params.id;
        this.updateView('uptime-details');
      },
    });

    this.router.notFound( () => {
      this.updateView('404-warning');
    });

    this.router.resolve();
  }

  updateView(view) {
    if (this.view !== view) {

      // Check if we find credentials in parameters (used for omniauth)
      // if true : store credentials and remove them from the query string
      if (this.getUrlParameter('auth_token')) {
        storeCredentials(this.getUrlParameter('auth_token'), this.getUrlParameter('uid'), this.getUrlParameter('client_id'));
        this.removeParameters();
      }

      if (view !== 'signin' && view !== 'signup' && view !== 'forgot-password' && view !== 'edit-password') {
        if (!isLogged()) {
          store.dispatch(updateRoute('signin'));
        }
      }

      const oldView = this.view;
      this.view = view;

      this.loadView(view, oldView);
    }
  }

  firstUpdated() {
    store.dispatch(loadEnvironment());
    store.dispatch(loadSubscriptionPlans());
    this.removeAttribute('unresolved');

    if (!this.loadComplete) {
      import('./lazy-resources.js').then(async () => {
        this.notifyNetworkStatus();
        this.loadComplete = true;
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      store.dispatch(showInstallPrompt(e));
    });


    window.addEventListener('online', e => this.notifyNetworkStatus(e));
    window.addEventListener('offline', e => this.notifyNetworkStatus(e));
  }

  /**
   * Lazy load views
   * @param {*} view
   * @param {*} oldView
   */
  loadView(view, oldView) {
    if (view !== null) {
      // home and signin route are eagerly loaded
      if (view === 'home' || view === 'signin') {
        this.viewLoaded(Boolean(oldView));
      // other routes are lazy loaded
      } else {
        // When a load failed, it triggered a 404 which means we need to
        // eagerly load the 404 page definition
        const cb = this.viewLoaded.bind(this, Boolean(oldView));

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
      if (this.scrollPositions && this.scrollPositions.has(this.route)) {
        window.scroll(0, this.scrollPositions.get(this.route));
      } else {
        window.scroll(0, 0);
      }
    }
  }

  viewLoaded() {
    this.sendAnalytics(this.route);

    if (isLogged()) {
      this.loadCurrentViewData();
    }
  }

  loadCurrentViewData() {
    if (store && !store.getState().app.stripeSubscription && isLogged()) {
      store.dispatch(loadStripeSubscription());
    }

    if (this.view === 'home') {
      store.dispatch(loadPages());
    } else if (this.view === 'account') {
      store.dispatch(loadUser());
    } else if (this.view === 'page') {
      store.dispatch(loadPage(this.pageId));
      store.dispatch(loadPageStats(this.pageId, this.period));
      store.dispatch(loadBudgets(this.pageId, this.period));
    } else if (this.view === 'edit-page') {
      store.dispatch(loadPage(this.pageId));
    } else if (this.view === 'members') {
      store.dispatch(loadPage(this.pageId));
      store.dispatch(loadPageMembers(this.pageId));
    } else if (this.view === 'lighthouse-details' || this.view === 'performance-details') {
      store.dispatch(loadPage(this.pageId));
      store.dispatch(loadLighthouseDetails(this.pageId, this.period));
    } else if (this.view === 'uptime-details') {
      store.dispatch(loadPage(this.pageId));
      store.dispatch(loadUptimeDetails(this.pageId, this.period));
    } else if (this.view === 'requests-details' || this.view === 'bytes-details') {
      store.dispatch(loadAssetsDetails(this.pageId, this.period));
    }
  }

  sendAnalytics(route) {
    if (this.shadowRoot) {
      const analytics = this.shadowRoot.getElementById('analytics');
      if (analytics) {
        analytics.sendPath(route);
      }
    }
  }

  notifyNetworkStatus() {
    const oldOffline = this.offline;
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

  showMessageSnack(newVal) {
    if (newVal && newVal.text) {
      const snack = this.shadowRoot.getElementById('messageSnack');
      snack.labelText = newVal.text;
      snack.leading = window.innerWidth > 800;
      snack.open();
    }
  }


  getUrlParameter(name) {
    const replaced = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${replaced}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Remove all query string from the url (and hash too)
   */
  removeParameters() {
    const newLocation = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    window.history.pushState('', document.title, newLocation);
  }
}

customElements.define('bnb-app', BnbApp);
