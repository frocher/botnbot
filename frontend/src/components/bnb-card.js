import { LitElement, css, html } from 'lit-element';


class BnbCard extends LitElement {
  static get styles() {
    return css`
    `;
  }


  render() {
    return html`
    <paper-card placeholder-image="${this.getPlaceHolderImage()}" fade-image preload-image image="${this.getScreenshotUrl(this.page)}" animated="true" @click="cardTapped" class="${this.computeCardClass(this.page)}">
      <div class="card-content">
        <h2><mwc-icon>${this.computeIcon(this.page)}</mwc-icon>${this.page.name}</h2>
        <a href="${this.page.url}" @click="urlTapped" target="_blank" title="Open url in a new tab" rel="noopener">${this.page.url}</a>
      </div>
      <mwc-ripple primary></mwc-ripple>

    </paper-card>
    `;
  }
}
window.customElements.define('bnb-card', BnbCard);
