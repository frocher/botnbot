import { LitElement, css, html } from 'lit-element';
import lozad from 'lozad';

export default class BnbLazyImage extends LitElement {
  static get properties() {
    return {
      placeholder: { type: String },
      src: { type: String },
      width: { type: Number },
      height: { type: Number },
    };
  }

  static get styles() {
    return css`
      img {
        width: 100%;
        opacity: 0.3;
      }

      img[data-loaded] {
        opacity: 1;
        transition-delay: 1s;
        transition: opacity 0.6s;
      }
    `;
  }

  constructor() {
    super();
    this.placeholder = this.getDefaultPlaceHolderImage();
  }

  render() {
    return html`<img id="el" src="${this.placeholder}" data-src="${this.src}" ?width="${this.width}" ?height="${this.height}"/>`;
  }

  getDefaultPlaceHolderImage() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADwAQMAAABL4y8oAAAAA1BMVEW9vb2OR09dAAAAIElEQVR4Xu3AgQAAAADDoPtTX2EAtQAAAAAAAAAAAAAOJnAAAZexSsoAAAAASUVORK5CYII=';
  }

  firstUpdated() {
    const el = this.shadowRoot.getElementById('el');
    const observer = lozad(el);
    observer.observe();
  }
}

customElements.define('bnb-lazy-image', BnbLazyImage);
