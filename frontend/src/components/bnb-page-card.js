import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon';
import '@material/mwc-ripple';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { getRequestUrl } from '../common';
import { updateRoute } from '../actions/app';

class BnbPageCard extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: { type: Object },
    };
  }

  static get styles() {
    return css`
    paper-card {
      display: block;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    :host {
      --paper-card-header: {
        height: 0;
        overflow: hidden;
        padding-top: calc(3 / 4 * 100%);
        background: white;
        position: relative;
      };
      --paper-card-header-image: {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      };
    }

    mwc-icon {
      display: inline-block;
      padding-right: 4px;
      vertical-align: sub;
    }

    .card-content h2 {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-content a {
      display: block;
      color: #9e9e9e;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-content a:hover {
      text-decoration: underline;
    }

    .locked {
      filter: blur(3px);
    }

    .hurt {
      animation: pulse 5s infinite;
      filter: grayscale(0);
    }

    @keyframes pulse {
      0% {filter: grayscale(0)}
      50% {filter: grayscale(100%)}
      100% {filter: grayscale(0)}
    }

    .demo-box {
      min-width: 128px;
      min-height: 128px;
      border: 1px solid gray;
      display: inline-flex;
      position: relative;
      justify-content: center;
      text-align: center;
      flex-direction: column;
      padding: 8px;
    }
    `;
  }

  rendertr() {
    return html`
    <div class="demo-box"
      @click="${this.cardTapped}"
      @focus="${this.handleRippleFocus}"
      @blur="${this.handleRippleBlur}"
      @mousedown="${this.handleRippleActivate}"
      @mouseup="${this.handleRippleDeactivate}"
      @mouseenter="${this.handleRippleMouseEnter}"
      @mouseleave="${this.handleRippleMouseLeave}"
      @touchstart="${this.handleRippleActivate}"
      @touchend="${this.handleRippleDeactivate}"
      @touchcancel="${this.handleRippleDeactivate}">
      <mwc-ripple id="ripple"></mwc-ripple>
    </div>
    `;
  }

  render() {
    return html`
    <paper-card
      placeholder-image="${this.getPlaceHolderImage()}"
      fade-image
      preload-image
      image="${this.getScreenshotUrl(this.page)}"
      animated="true"
      class="${this.computeCardClass(this.page)}"
      @click="${this.cardTapped}"
      @focus="${this.handleRippleFocus}"
      @blur="${this.handleRippleBlur}"
      @mousedown="${this.handleRippleActivate}"
      @mouseup="${this.handleRippleDeactivate}"
      @mouseenter="${this.handleRippleMouseEnter}"
      @mouseleave="${this.handleRippleMouseLeave}"
      @touchstart="${this.handleRippleActivate}"
      @touchend="${this.handleRippleDeactivate}"
      @touchcancel="${this.handleRippleDeactivate}">
      <div class="card-content">
        <h2><mwc-icon>${this.computeIcon(this.page)}</mwc-icon>${this.page.name}</h2>
        <a href="${this.page.url}" @click="urlTapped" target="_blank" title="Open url in a new tab" rel="noopener">${this.page.url}</a>
      </div>
      <mwc-ripple id="ripple"></mwc-ripple>

    </paper-card>
    `;
  }

  stateChanged() {
    // Nothing to do
  }

  cardTapped() {
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  urlTapped(e) {
    e.stopPropagation();
  }

  getPlaceHolderImage() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADwAQMAAABL4y8oAAAAA1BMVEW9vb2OR09dAAAAIElEQVR4Xu3AgQAAAADDoPtTX2EAtQAAAAAAAAAAAAAOJnAAAZexSsoAAAAASUVORK5CYII=';
  }

  getScreenshotUrl(item) {
    return getRequestUrl(`pages/${item.id}/screenshot?style=thumb`);
  }

  computeIcon(item) {
    return item.device === 'mobile' ? 'smartphone' : 'computer';
  }

  computeCardClass(item) {
    if (item.locked) {
      return 'locked';
    }

    if (item.uptime_status === 0) {
      return 'hurt';
    }

    return '';
  }

  get ripple() {
    return this.shadowRoot.getElementById('ripple');
  }

  handleRippleActivate(e) {
    this.ripple.startPress(e);
  }

  handleRippleDeactivate() {
    this.ripple.endPress();
  }

  handleRippleMouseEnter() {
    this.ripple.startHover();
  }

  handleRippleMouseLeave() {
    this.ripple.endHover();
  }

  handleRippleFocus() {
    this.ripple.startFocus();
  }

  handleRippleBlur() {
    this.ripple.endFocus();
  }
}
window.customElements.define('bnb-page-card', BnbPageCard);
