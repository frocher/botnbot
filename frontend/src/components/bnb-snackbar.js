import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { flush } from '@polymer/polymer/lib/legacy/polymer.dom';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { timeOut } from '@polymer/polymer/lib/utils/async';

class BnbSnackbar extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: fixed;
      left: calc(50% - 160px);
      right: calc(50% - 160px);
      bottom: 0;
      width: 320px;
      background-color: var(--app-nav-background-color);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      color: var(--app-nav-text-color);
      padding: 12px;
      visibility: hidden;
      text-align: center;
      will-change: transform;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
      transition-property: visibility, -webkit-transform;
      transition-property: visibility, transform;
      transition-duration: 0.2s;
    }

    :host(.opened) {
      visibility: visible;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    @media (max-width: 767px) {
      :host {
        left: 0;
        right: 0;
        width: auto;
      }
    }
    </style>

    <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'assertive');
  }

  open() {
    flush();
    this.offsetHeight && this.classList.add('opened');
    this._closeDebouncer = Debouncer.debounce(this._closeDebouncer,
      timeOut.after(4000), this.close.bind(this));
  }

  close() {
    this.classList.remove('opened');
  }
}

customElements.define('bnb-snackbar', BnbSnackbar);
