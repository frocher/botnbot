import { LitElement, css, html } from 'lit';
import { createPopper } from '@popperjs/core';
import { format, formatDistance } from 'date-fns';
import '@material/mwc-icon';
import { tooltipStyles } from '../components/bnb-tooltip-styles';

class BnbDownAlert extends LitElement {
  static get styles() {
    return [
      tooltipStyles,
      css`
      mwc-icon {
        width: 40px;
        height: 40px;
        --mdc-icon-size: 40px;
        color: var(--mdc-theme-error);
      }`,
    ];
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
