import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-icon-button/paper-icon-button';
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import { connect } from 'pwa-helpers';
import { format } from 'date-fns';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { getRequestUrl } from '../common';
import './bnb-common-styles';
import './bnb-grid-styles';
import './bnb-icons';

class BnbBytesDetails extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        display: flex;
        justify-content: center;
        padding: 8px;
      }

      a {
        color: rgba(0, 0, 0, var(--dark-primary-opacity));
      }

      .right {
        text-align: right;
      }

      vaadin-grid {
        height: calc(100vh - 80px);
        max-width: 800px;
      }
    </style>

    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="bnb:arrow-back" on-tap="_backTapped"></paper-icon-button>
          <span>[[page.name]]</span>
        </app-toolbar>
      </app-header>

      <div id="content" class="fit">
        <vaadin-grid id="grid" theme="bnb-grid" items="[[assetsDetails]]">
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="time" direction="desc">time</vaadin-grid-sorter>
            </template>
            <template>[[_formatTime(item.time)]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">html</template>
            <template><div class="right">[[_formatBytes(item.html_bytes)]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">css</template>
            <template><div class="right">[[_formatBytes(item.css_bytes)]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">javascript</template>
            <template><div class="right">[[_formatBytes(item.js_bytes)]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">image</template>
            <template><div class="right">[[_formatBytes(item.image_bytes)]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">font</template>
            <template><div class="right">[[_formatBytes(item.font_bytes)]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
              <template class="header">other</template>
              <template><div class="right">[[_formatBytes(item.other_bytes)]]</div></template>
            </vaadin-grid-column>
            <vaadin-grid-column width="52px" flex-grow="0">
            <template class="header"></template>
            <template>
              <a href="[[_computeUrl(item.time_key)]]" title="Show HAR" target="_blank">
                <paper-icon-button icon="bnb:visibility"></paper-icon-button>
              </a>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    </app-header-layout>
    `;
  }

  static get properties() {
    return {
      page: Object,
      assetsDetails: Object,
    };
  }

  stateChanged(state) {
    this.page = state.pages.current;
    this.assetsDetails = state.stats.assets_details;
  }

  _backTapped() {
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  _formatTime(time) {
    return format(new Date(time), 'MMM dd, yyyy HH:mm');
  }

  _formatBytes(bytes) {
    return Math.round(bytes / 1024).toLocaleString();
  }

  _computeUrl(key) {
    if (key) {
      let result = 'http://www.softwareishard.com/har/viewer/?inputUrl=';
      result += `${window.location.protocol}//${window.location.host}`;
      result += getRequestUrl(`pages/${this.page.id}/assets/${key}`);
      return result;
    }
    return '';
  }
}

window.customElements.define('bnb-bytes-details', BnbBytesDetails);
