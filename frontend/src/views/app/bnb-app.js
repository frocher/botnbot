import { LitElement, css, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import '@material/mwc-snackbar';
import { connect } from 'pwa-helpers';
import Router from 'navigo';
import { store } from '../../state/store';
import {
  updateRoute, loadEnvironment, loadSubscriptionPlans, showInstallPrompt, updateMessage,
} from '../../state/app/actions';
import { loadBudgets } from '../../state/budgets/actions';
import { loadPageMembers } from '../../state/members/actions';
import { loadPages, loadPage } from '../../state/pages/actions';
import {
  loadPageStats, loadLighthouseDetails, loadAssetsDetails, loadUptimeDetails,
} from '../../state/stats/actions';
import { loadStripeSubscription, loadUser } from '../../state/account/actions';
import { isLogged, storeCredentials } from '../../utilities/credentials';
import '../pages/bnb-pages';
import '../auth/bnb-signin';
import { styles } from '../components/bnb-styles';

class BnbApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      message: { type: Object },
      offline: { type: Boolean },
      params: { type: Object },
      period: { type: Object },
      route: { type: String },
      view: { type: String },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      :host {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-color: var(--mdc-theme-background);
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
      `,
    ];
  }

  constructor() {
    super();
    this.initRouter();
    this.scrollPositions = new Map();
  }

  render() {
    return html`
    <bnb-add-page            class=${classMap(this.renderClass('add-page'))}></bnb-add-page>
    <bnb-account             class=${classMap(this.renderClass('account'))}></bnb-account>
    <bnb-bytes-details       class=${classMap(this.renderClass('bytes-details'))}></bnb-bytes-details>
    <bnb-pages               class=${classMap(this.renderClass('home'))}></bnb-pages>
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
    <mwc-snackbar id="reloadSnack" labelText="Application has been updated" timeoutMs="-1">
      <mwc-button slot="action" @click="${this.reloadClosed}">RELOAD</mwc-button>
      <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
    </mwc-snackbar>
    `;
  }

  renderClass(name) {
    return name === this.view ? { view: true, active: true } : { view: true };
  }

  stateChanged(state) {
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
    this.router = new Router('/');

    this.router.on({
      '/add-page': () => {
        this.updateView('add-page');
      },
      '/account': () => {
        this.updateView('account');
      },
      '/bytes-details/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('bytes-details');
      },
      '/edit-page/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('edit-page');
      },
      '/edit-password': () => {
        this.updateView('edit-password');
      },
      '/forgot-password': () => {
        this.updateView('forgot-password');
      },
      '/': () => {
        this.updateView('home');
      },
      '/lighthouse-details/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('lighthouse-details');
      },
      '/members/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('members');
      },
      '/page/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('page');
      },
      '/performance-details/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('performance-details');
      },
      '/requests-details/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('requests-details');
      },
      '/signin': () => {
        this.updateView('signin');
      },
      '/signup': () => {
        this.updateView('signup');
      },
      '/uptime-details/:id': (params) => {
        this.pageId = params.data.id;
        this.updateView('uptime-details');
      },
    });

    this.router.notFound(() => {
      this.updateView('404-warning');
    });

    this.router.resolve();
  }

  showReloadSnack(params) {
    this.reloadParams = params;
    this.shadowRoot.getElementById('reloadSnack').show();
  }

  reloadClosed() {
    this.reloadParams.onAccept();
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

    this.shadowRoot.getElementById('reloadSnack').addEventListener('closed', (e) => this.reloadClosed(e.detail.reason));
    window.addEventListener('online', (e) => this.notifyNetworkStatus(e));
    window.addEventListener('offline', (e) => this.notifyNetworkStatus(e));
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
            import('../pages/bnb-add-page.js').then(cb);
            break;
          case 'bytes-details':
            import('../details/bnb-bytes-details.js').then(cb);
            break;
          case 'edit-page':
            import('../pages/bnb-edit-page.js').then(cb);
            break;
          case 'edit-password':
            import('../auth/bnb-edit-password.js').then(cb);
            break;
          case 'forgot-password':
            import('../auth/bnb-forgot-password.js').then(cb);
            break;
          case 'lighthouse-details':
            import('../details/bnb-lighthouse-details.js').then(cb);
            break;
          case 'members':
            import('../members/bnb-members.js').then(cb);
            break;
          case 'page':
            import(/* webpackPrefetch: true */ '../pages/bnb-page.js').then(cb);
            break;
          case 'performance-details':
            import('../details/bnb-performance-details.js').then(cb);
            break;
          case 'requests-details':
            import('../details/bnb-requests-details.js').then(cb);
            break;
          case 'signup':
            import('../auth/bnb-signup.js').then(cb);
            break;
          case 'uptime-details':
            import('../details/bnb-uptime-details.js').then(cb);
            break;
          case 'account':
            import('../account/bnb-account.js').then(cb);
            break;
          default:
            this.viewLoaded(Boolean(oldView));
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
      store.dispatch(loadPage(this.pageId));
      store.dispatch(loadAssetsDetails(this.pageId, this.period));
    }
  }

  notifyNetworkStatus() {
    const oldOffline = this.offline;
    // Show the snackbar if the user is offline when starting a new session
    // or if the network status changed.
    this.offline = !window.navigator.onLine;
    if (this.offline || (!this.offline && oldOffline === true)) {
      const message = this.offline ? 'You are offline' : 'You are online';
      store.dispatch(updateMessage(message));
    }
  }

  showMessageSnack(newVal) {
    if (newVal && newVal.text) {
      const snack = this.shadowRoot.getElementById('messageSnack');
      snack.labelText = newVal.text;
      snack.leading = window.innerWidth > 800;
      snack.show();
    }
  }

  getUrlParameter(name) {
    // eslint-disable-next-line no-useless-escape
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
