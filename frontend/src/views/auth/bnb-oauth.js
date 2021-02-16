import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import { getRequestUrl } from '../../utilities/api';
import '../components/bnb-divider';

class BnbOAuth extends LitElement {
  static get styles() {
    return css`
      mwc-button {
        --mdc-typography-button-font-size: 13px;
        --mdc-typography-button-font-weight: bold;
        --mdc-typography-button-letter-spacing: 0;
        --mdc-typography-button-text-transform: none;
      }

      .buttons {
        margin-bottom: 24px;
      }

      .icon {
        width: 24px;
        height: 24px;
        margin-top: 4px;
        margin-right: 6px;
      }

      .buttons {
        display: flex;
        justify-content: space-around;
      }

      #facebook {
        background-color: transparent;
        --mdc-theme-primary: #3C5A99;
        --mdc-theme-on-primary: #fff;
      }

      #github {
        background-color: transparent;
        --mdc-theme-primary: #333;
        --mdc-theme-on-primary: #fff;
      }

      #google {
        background-color: transparent;
        --mdc-theme-primary: #fff;
        --mdc-theme-on-primary: var(--paper-grey-600);
      }

      @media (max-width: 500px) {
        mwc-button {
          --mdc-typography-button-font-size: 10px;
        }

        .icon {
          display: none;
        }
      }
      `;
  }

  render() {
    return html`
    <div>
      <div class="buttons">
        <mwc-button unelevated id="facebook">
          <span name="icon">${this.facebookIcon}</span>
          <span>Facebook</span>
        </mwc-button>
        <mwc-button unelevated id="github">
          <span name="icon">${this.githubIcon}</span>
          <span>GitHub</span>
        </mwc-button>
        <mwc-button unelevated id="google">
          <span name="icon">${this.googleIcon}</span>
          <span>Google</span>
        </mwc-button>
      </div>
    </div>
    `;
  }

  get facebookIcon() {
    return html`
    <svg class="icon" viewBox="0 0 32 32" style="fill: white">
      <path d='M30.2,0H1.8C0.8,0,0,0.8,0,1.8v28.5c0,1,0.8,1.8,1.8,1.8h15.3V19.6h-4.2v-4.8h4.2v-3.6 c0-4.1,2.5-6.4,6.2-6.4C25.1,4.8,26.6,5,27,5v4.3l-2.6,0c-2,0-2.4,1-2.4,2.4v3.1h4.8l-0.6,4.8h-4.2V32h8.2c1,0,1.8-0.8,1.8-1.8V1.8 C32,0.8,31.2,0,30.2,0z'/>
    </svg>
    `;
  }

  get githubIcon() {
    return html`
    <svg class="icon" viewBox="0 0 32 32" style="fill: white">
      <path d='M16,0.4c-8.8,0-16,7.2-16,16c0,7.1,4.6,13.1,10.9,15.2 c0.8,0.1,1.1-0.3,1.1-0.8c0-0.4,0-1.4,0-2.7c-4.5,1-5.4-2.1-5.4-2.1c-0.7-1.8-1.8-2.3-1.8-2.3c-1.5-1,0.1-1,0.1-1 c1.6,0.1,2.5,1.6,2.5,1.6c1.4,2.4,3.7,1.7,4.7,1.3c0.1-1,0.6-1.7,1-2.1c-3.6-0.4-7.3-1.8-7.3-7.9c0-1.7,0.6-3.2,1.6-4.3 c-0.2-0.4-0.7-2,0.2-4.2c0,0,1.3-0.4,4.4,1.6c1.3-0.4,2.6-0.5,4-0.5c1.4,0,2.7,0.2,4,0.5C23.1,6.6,24.4,7,24.4,7 c0.9,2.2,0.3,3.8,0.2,4.2c1,1.1,1.6,2.5,1.6,4.3c0,6.1-3.7,7.5-7.3,7.9c0.6,0.5,1.1,1.5,1.1,3c0,2.1,0,3.9,0,4.4 c0,0.4,0.3,0.9,1.1,0.8C27.4,29.5,32,23.5,32,16.4C32,7.6,24.8,0.4,16,0.4z'/>
    </svg>
    `;
  }

  get googleIcon() {
    return html`
    <svg class="icon" viewBox="0 0 32 32">
      <defs>
      <clipPath id="clip1">
        <path d="M 1 7 L 12 7 L 12 25 L 1 25 Z M 1 7 "/>
      </clipPath>
      <clipPath id="clip2">
        <path d="M 29.667969 13.332031 L 16 13.332031 L 16 19 L 23.867188 19 C 23.132812 22.601562 20.066406 24.667969 16 24.667969 C 11.199219 24.667969 7.332031 20.800781 7.332031 16 C 7.332031 11.199219 11.199219 7.332031 16 7.332031 C 18.066406 7.332031 19.933594 8.066406 21.398438 9.265625 L 25.667969 5 C 23.066406 2.734375 19.734375 1.332031 16 1.332031 C 7.867188 1.332031 1.332031 7.867188 1.332031 16 C 1.332031 24.132812 7.867188 30.667969 16 30.667969 C 23.332031 30.667969 30 25.332031 30 16 C 30 15.132812 29.867188 14.199219 29.667969 13.332031 Z M 29.667969 13.332031 "/>
      </clipPath>
      <clipPath id="clip3">
        <path d="M 1 1 L 30 1 L 30 16 L 1 16 Z M 1 1 "/>
      </clipPath>
      <clipPath id="clip4">
        <path d="M 29.667969 13.332031 L 16 13.332031 L 16 19 L 23.867188 19 C 23.132812 22.601562 20.066406 24.667969 16 24.667969 C 11.199219 24.667969 7.332031 20.800781 7.332031 16 C 7.332031 11.199219 11.199219 7.332031 16 7.332031 C 18.066406 7.332031 19.933594 8.066406 21.398438 9.265625 L 25.667969 5 C 23.066406 2.734375 19.734375 1.332031 16 1.332031 C 7.867188 1.332031 1.332031 7.867188 1.332031 16 C 1.332031 24.132812 7.867188 30.667969 16 30.667969 C 23.332031 30.667969 30 25.332031 30 16 C 30 15.132812 29.867188 14.199219 29.667969 13.332031 Z M 29.667969 13.332031 "/>
      </clipPath>
      <clipPath id="clip5">
        <path d="M 1 1 L 30 1 L 30 31 L 1 31 Z M 1 1 "/>
      </clipPath>
      <clipPath id="clip6">
        <path d="M 29.667969 13.332031 L 16 13.332031 L 16 19 L 23.867188 19 C 23.132812 22.601562 20.066406 24.667969 16 24.667969 C 11.199219 24.667969 7.332031 20.800781 7.332031 16 C 7.332031 11.199219 11.199219 7.332031 16 7.332031 C 18.066406 7.332031 19.933594 8.066406 21.398438 9.265625 L 25.667969 5 C 23.066406 2.734375 19.734375 1.332031 16 1.332031 C 7.867188 1.332031 1.332031 7.867188 1.332031 16 C 1.332031 24.132812 7.867188 30.667969 16 30.667969 C 23.332031 30.667969 30 25.332031 30 16 C 30 15.132812 29.867188 14.199219 29.667969 13.332031 Z M 29.667969 13.332031 "/>
      </clipPath>
      <clipPath id="clip7">
        <path d="M 8 7 L 30 7 L 30 31 L 8 31 Z M 8 7 "/>
      </clipPath>
      <clipPath id="clip8">
        <path d="M 29.667969 13.332031 L 16 13.332031 L 16 19 L 23.867188 19 C 23.132812 22.601562 20.066406 24.667969 16 24.667969 C 11.199219 24.667969 7.332031 20.800781 7.332031 16 C 7.332031 11.199219 11.199219 7.332031 16 7.332031 C 18.066406 7.332031 19.933594 8.066406 21.398438 9.265625 L 25.667969 5 C 23.066406 2.734375 19.734375 1.332031 16 1.332031 C 7.867188 1.332031 1.332031 7.867188 1.332031 16 C 1.332031 24.132812 7.867188 30.667969 16 30.667969 C 23.332031 30.667969 30 25.332031 30 16 C 30 15.132812 29.867188 14.199219 29.667969 13.332031 Z M 29.667969 13.332031 "/>
      </clipPath>
      </defs>
      <g id="surface1">
      <g clip-path="url(#clip1)" clip-rule="nonzero">
      <g clip-path="url(#clip2)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(98.431373%,73.72549%,1.960784%);fill-opacity:1;" d="M 0 24.667969 L 0 7.332031 L 11.332031 16 Z M 0 24.667969 "/>
      </g>
      </g>
      <g clip-path="url(#clip3)" clip-rule="nonzero">
      <g clip-path="url(#clip4)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(91.764706%,26.27451%,20.784314%);fill-opacity:1;" d="M 0 7.332031 L 11.332031 16 L 16 11.933594 L 32 9.332031 L 32 0 L 0 0 Z M 0 7.332031 "/>
      </g>
      </g>
      <g clip-path="url(#clip5)" clip-rule="nonzero">
      <g clip-path="url(#clip6)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(20.392157%,65.882353%,32.54902%);fill-opacity:1;" d="M 0 24.667969 L 20 9.332031 L 25.265625 10 L 32 0 L 32 32 L 0 32 Z M 0 24.667969 "/>
      </g>
      </g>
      <g clip-path="url(#clip7)" clip-rule="nonzero">
      <g clip-path="url(#clip8)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(25.882353%,52.156863%,95.686275%);fill-opacity:1;" d="M 32 32 L 11.332031 16 L 8.667969 14 L 32 7.332031 Z M 32 32 "/>
      </g>
      </g>
      </g>
    </svg>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('facebook').addEventListener('click', () => this.facebookTapped());
    this.shadowRoot.getElementById('github').addEventListener('click', () => this.githubTapped());
    this.shadowRoot.getElementById('google').addEventListener('click', () => this.googleTapped());
  }

  facebookTapped() {
    this.callService('facebook');
  }

  githubTapped() {
    this.callService('github');
  }

  googleTapped() {
    this.callService('google_oauth2');
  }

  callService(service) {
    const origin = `${window.location.protocol}//${window.location.host}`;
    const url = getRequestUrl(`auth/${service}?auth_origin_url=${origin}`);
    window.location.replace(url);
  }
}

window.customElements.define('bnb-oauth', BnbOAuth);
