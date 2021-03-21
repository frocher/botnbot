import { LitElement, css, html } from 'lit-element';
import { createPopper } from '@popperjs/core';
import { format, formatDistance } from 'date-fns';
import '@material/mwc-icon';

class BnbDownAlert extends LitElement {
  static get styles() {
    return css`
      mwc-icon {
        width: 40px;
        height: 40px;
        --mdc-icon-size: 40px;
        color: var(--mdc-theme-error);
      }

      #tooltip {
        visibility: hidden;
        min-width: 100px;
        position: absolute;
        background-color: var(--mdc-theme-on-secondary, #333);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-weight: normal;
        z-index: 1060;
        opacity: 0.9;
      }
  
      #arrow,
      #arrow::before {
        position: absolute;
        width: 8px;
        height: 8px;
        z-index: -1;
      }
      
      #arrow::before {
        content: '';
        transform: rotate(45deg);
        background: var(--mdc-theme-on-secondary, #333);
      }
  
      #tooltip[data-popper-placement^='top'] > #arrow {
        bottom: -4px;
      }
      
      #tooltip[data-popper-placement^='bottom'] > #arrow {
        top: -4px;
      }
      
      #tooltip[data-popper-placement^='left'] > #arrow {
        right: -4px;
      }
      
      #tooltip[data-popper-placement^='right'] > #arrow {
        left: -4px;
      }
    `;
  }

  static get properties() {
    return {
      lastDowntime: { type: String },
    };
  }

  render() {
    return html`
    <mwc-icon id="icon">error</mwc-icon>
    <div id="tooltip" role="tooltip">
      <span>${this.renderTooltip()}</span>
      <div id="arrow" data-popper-arrow="true"></div>
    </div>
    `;
  }

  renderTooltip() {
    const from = this.lastDowntime;
    if (from !== 'null') {
      const duration = formatDistance(new Date(from), new Date());
      return html`Site is down since ${this.formatTime(from)} (${duration})`;
    }
    return html`Site is down.`;
  }

  formatTime(time) {
    return format(new Date(time), 'MMM dd, yyyy HH:mm');
  }

  firstUpdated() {
    const icon = this.shadowRoot.getElementById('icon');
    const tooltip = this.shadowRoot.getElementById('tooltip');

    icon.addEventListener('mouseenter', () => { tooltip.style.visibility = 'visible'; });
    icon.addEventListener('mouseleave', () => { tooltip.style.visibility = 'hidden'; });

    createPopper(icon, tooltip, {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });
  }
}

window.customElements.define('bnb-down-alert', BnbDownAlert);
