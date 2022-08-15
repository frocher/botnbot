import { LitElement, css, html } from 'lit';
import '@material/mwc-icon';
import { createPopper } from '@popperjs/core';
import { tooltipStyles } from '../components/bnb-tooltip-styles';

class BnbPageCardTitle extends LitElement {
  static get properties() {
    return {
      icon: { type: String },
      text: { type: String },
      url: { type: String },
      description: { type: String },
    };
  }

  static get styles() {
    return [
      tooltipStyles,
      css`
      mwc-icon {
        display: inline-block;
        padding-right: 4px;
        vertical-align: sub;
      }

      h2 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
      }

      a {
        display: block;
        color: #9e9e9e;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a:hover {
        text-decoration: underline;
      }
      `,
    ];
  }

  render() {
    return html`
       <div>
          <h2 id="title"><mwc-icon>${this.icon}</mwc-icon>${this.text}</h2>
          <a href="${this.url}" @click="${this.urlTapped}" target="_blank" title="Open url in a new tab" rel="noopener">
            ${this.url}
          </a>
        </div>
        ${this.renderTooltip()}
    `;
  }

  renderTooltip() {
    if (this.description) {
      return html`
      <div id="tooltip" role="tooltip">
        <span>${this.description}</span>
        <div id="arrow" data-popper-arrow="true"></div>
      </div>
      `;
    }
    return html``;
  }

  firstUpdated() {
    const title = this.shadowRoot.getElementById('title');
    const tooltip = this.shadowRoot.getElementById('tooltip');
    if (tooltip) {
      title.addEventListener('mouseenter', () => { tooltip.style.visibility = 'visible'; });
      title.addEventListener('mouseleave', () => { tooltip.style.visibility = 'hidden'; });

      createPopper(title, tooltip, {
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

  urlTapped(e) {
    e.stopPropagation();
  }
}
window.customElements.define('bnb-page-card-title', BnbPageCardTitle);
