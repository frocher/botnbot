import { LitElement, css, html } from 'lit-element';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-radio';
import '@material/mwc-top-app-bar-fixed';
import { connect } from 'pwa-helpers';
import { fromHar } from 'perf-cascade';
import { styles } from '../components/bnb-styles';
import { harStyles } from './bnb-har-styles';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import '../components/bnb-card';

export class BnbAssetsReport extends connect(store)(LitElement) {
  static get styles() {
    return [
      styles,
      harStyles,
      css`
      #content {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      #container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
      }

      #treeChartContent {
        height: 500px;
      }
      `,
    ];
  }

  static get properties() {
    return {
      har: { type: Object },
    };
  }

  stateChanged(state) {
    this.page = state.pages.current;
    if (state.reports.assets) {
      this.har = state.reports.assets;
      if (this.har) {
        this.entries = this.parseHAR(this.har);
      }
    }
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button id="backBtn" icon="arrow_back" slot="navigationIcon"></mwc-icon-button>
      <div slot="title">Assets report</div>
      <div id="content">
        <div id="container">
          <h3>Network</h3>
          <bnb-card>
            <div id="harContent"></div>
            <div id="harLegend"></div>
          </bnb-card>

          <h3>Requests map</h3>
          <bnb-card>
            <div id="treeChartContent">
              <canvas id="treechart" width="800" height="400"></canvas>
            </div>
            <mwc-formfield label="Size">
              <mwc-radio id="sizeBtn" name="treemap" group="treemapGroup" @click="${this.sizeTapped}" checked></mwc-radio>
            </mwc-formfield>
            <mwc-formfield label="Time">
              <mwc-radio id="timeBtn" name="treemap" group="treemapGroup" @click="${this.timeTapped}"></mwc-radio>
            </mwc-formfield>
          </bnb-card>
        </div>
      </div>

    </mwc-top-app-bar-fixed>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('backBtn').addEventListener('click', () => this.backTapped());
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('har')) {
      const content = this.shadowRoot.getElementById('harContent');
      if (content.firstChild) {
        content.removeChild(content.firstChild);
      }
      const options = {
        legendHolder: this.shadowRoot?.getElementById('harLegend'),
        showUserTiming: true,
      };
      const cascadeSvg = fromHar(this.har, options);
      content.appendChild(cascadeSvg);
      this.updateChart();
    }
  }

  colorFromItem(type, url) {
    let color = '#03a9f4';

    if (url) {
      color = Chart.helpers.color('white').alpha(0.3).rgbString();
    } else if (type === 'html') {
      color = '#4caf50';
    } else if (type === 'css') {
      color = '#f44336';
    } else if (type === 'js') {
      color = '#ffc107';
    } else if (type === 'font') {
      color = '#ff5722';
    } else if (type === 'image') {
      color = '#ffeb3b';
    }

    return color;
  }

  truncate(str, size, prefix) {
    if (str.length < size) {
      return str;
    }

    if (prefix) {
      return `...${str.substr(str.length - size)}`;
    }

    return `${str.substr(0, size - 1)}...`;
  }

  updateChart() {
    const ctx = this.shadowRoot.getElementById('treechart');
    if (this.entries && ctx) {
      if (this.chart) {
        this.chart.data.datasets[0].tree = this.entries;
        this.chart.update();
      } else {
        const _this = this;

        const options = {
          maintainAspectRatio: false,
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
          tooltips: {
            callbacks: {
              title(item, data) {
                return data.datasets[item[0].datasetIndex].key;
              },
              label(item, data) {
                const dataset = data.datasets[item.datasetIndex];
                const dataItem = dataset.data[item.index];
                const obj = dataItem._data;
                const label = obj.url || obj.type;
                let value = '';
                if (data.datasets[0].key === 'size') {
                  value = `${Math.round(dataItem.v / 1024)}Kb`;
                } else {
                  value = `${Math.round(dataItem.v)}ms`;
                }
                return `${_this.truncate(label, 100, true)}: ${value}`;
              },
            },
          },
        };

        this.chart = new Chart(ctx, {
          type: 'treemap',
          data: {
            datasets: [
              {
                tree: this.entries,
                key: 'size',
                groups: ['type', 'url'],
                borderWidth: 0.5,
                fontColor: 'black',
                backgroundColor(context) {
                  const item = context.dataset.data[context.dataIndex];
                  if (!item) {
                    return;
                  }
                  const obj = item._data;
                  // eslint-disable-next-line consistent-return
                  return _this.colorFromItem(obj.type, obj.url);
                },
                borderColor: 'rgba(255,255,255,1)',
              },
            ],
          },
          options,
        });
      }
    }
  }

  backTapped() {
    // Nothing here
  }

  sizeTapped() {
    this.chart.data.datasets[0].key = 'size';
    this.chart.update();
  }

  timeTapped() {
    this.chart.data.datasets[0].key = 'time';
    this.chart.update();
  }

  parseHAR(har) {
    const entries = [];
    har.log.entries.forEach((entry) => entries.push(this.processEntry(entry)));
    return entries;
  }

  processEntry(entry) {
    const content = entry?.response?.content;
    const url = entry?.request?.url;
    const mimeType = content?.mimeType;
    const size = entry?.response?._transferSize || content?.size;
    const time = entry?.time;

    if (!mimeType && !url) {
      return {
        type: 'other', url, time, size,
      };
    }
    if (mimeType.includes('text/html')) {
      return {
        type: 'html', url, time, size,
      };
    }
    if (mimeType.includes('text/css')) {
      return {
        type: 'css', url, time, size,
      };
    }
    if (mimeType.includes('javascript') || mimeType.includes('/ecmascript')) {
      return {
        type: 'js', url, time, size,
      };
    }
    if (mimeType.includes('image/')) {
      return {
        type: 'image', url, time, size,
      };
    }
    if (mimeType.includes('font-') || mimeType.includes('ms-font') || mimeType.includes('font/')) {
      return {
        type: 'font', url, time, size,
      };
    }
    if (url.endsWith('.woff') || url.endsWith('.woff2')) {
      return {
        type: 'font', url, time, size,
      };
    }
    return {
      type: 'other', url, time, size,
    };
  }

  goto(url) {
    store.dispatch(updateRoute(url));
  }
}

export { BnbAssetsReport as default };
