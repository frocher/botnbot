import { LitElement, css, html } from 'lit';
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
    this.observer = lozad(el);
    this.observer.observe();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'src') {
      if (this.shadowRoot) {
        const img = this.shadowRoot.getElementById('el');
        // We have to force reload for images already lazy loaded
        if (img && img.dataset.loaded) {
          img.src = newValue;
        }
      }
    }
  }
}

customElements.define('bnb-lazy-image', BnbLazyImage);
