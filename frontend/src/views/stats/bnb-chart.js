import { LitElement, css, html } from 'lit';
import 'wc-spinners/dist/fulfilling-bouncing-circle-spinner';
import {
  Chart, LineController, TimeScale, PointElement, LineElement, LinearScale, Filler, Tooltip, Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Color from '@kurkle/color';
import { isEqual } from 'lodash-es';
import { styles } from '../components/bnb-styles';

Chart.register(
  LineController, TimeScale, PointElement, LineElement, LinearScale, Filler, Tooltip, Legend,
);

class BnbChart extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      model: { type: Array },
      symbol: { type: String },
      type: { type: String },
      footer: { type: String },
      selectedPage: { type: Number },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      :host {
        display: inline-block;
      }

      #canvas {
        position:relative;
        width: 100%;
        height: 100%;
      }

      #spinner {
        margin-left: 24px;
      }

      #loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #999;
        font-size: 24px;
      }

      #noData {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #999;
        font-size: 36px;
      }

      #noData span {
        margin-top: -50px;
      }
    `,
    ];
  }

  constructor() {
    super();
    this.symbol = '';
    this.type = 'line';
    this.selectedPage = 0;
  }

  render() {
    return html`
    <div id="loading" style="${this.renderStyle(0)}">
      <div>Loading</div>
      <fulfilling-bouncing-circle-spinner id="spinner"></fulfilling-bouncing-circle-spinner>
    </div>
    <div id="noData" style="${this.renderStyle(1)}">
      <span>No data</span>
    </div>
    <div id="canvas" style="${this.renderStyle(2)}">
      <canvas id="chart"></canvas>
    </div>
    `;
  }

  renderStyle(index) {
    return this.selectedPage === index ? '' : 'display:none';
  }

  firstUpdated() {
    const resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    resizeObserver.observe(this.shadowRoot.getElementById('canvas'));
  }

  update() {
    super.update();
    this.updateChart();
  }

  onResize() {
    if (this.chart) {
      this.chart.resize();
      this.chart.render(true);
    }
  }

  updateChart() {
    if (this.data) {
      if (this.hasValues(this.data)) {
        this.selectedPage = 2;
      } else {
        this.selectedPage = 1;
      }
    } else {
      this.selectedPage = 0;
    }

    if (this.data && this.hasValues(this.data)) {
      const chartData = this.createChartData();

      if (this.chart) {
        if (!isEqual(this.oldData, this.data)) {
          this.chart.data.datasets = chartData.datasets;
          this.chart.update();

          this.oldData = this.data;
        }
      } else {
        const options = {
          maintainAspectRatio: false,
          responsive: true,
          interaction: {
            mode: 'index',
          },
          elements: {
            line: {
              tension: 0.2,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: {
                  hour: 'hh:mm',
                },
              },
              ticks: {
                major: {
                  enabled: true,
                },
                maxRotation: 0,
                color: () => '#fff',
                font: (context) => {
                  if (context.tick && context.tick.major) {
                    return {
                      weight: 'bold',
                    };
                  }
                  return {};
                },
              },
            },
            y: {
              stacked: this.type === 'area',
              ticks: {
                color: () => '#fff',
              },
              min: 0,
            },
          },
          plugins: {
            tooltip: {
              position: 'nearest',
              mode: 'index',
              intersect: false,
              callbacks: {},
            },
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
              },
            },
          },
        };

        if (this.footer === 'sum') {
          options.plugins.tooltip.callbacks.footer = (tooltipItems) => {
            let sum = 0;
            tooltipItems.forEach((tooltipItem) => {
              sum += tooltipItem.dataset.data[tooltipItem.dataIndex].y;
            });
            return `Total: ${Math.round(sum)}`;
          };
        } else if (this.footer === 'mean') {
          options.plugins.tooltip.callbacks.footer = (tooltipItems) => {
            let sum = 0;
            tooltipItems.forEach((tooltipItem) => {
              sum += tooltipItem.dataset.data[tooltipItem.dataIndex].y;
            });
            return `Mean: ${Math.round(sum / tooltipItems.length)}`;
          };
        }

        const ctx = this.shadowRoot.getElementById('chart');
        if (ctx) {
          this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options,
          });
        }
      }
    }
  }

  transparentize(color, opacity) {
    const alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Color(color).alpha(alpha).rgbString();
  }

  hasValues(data) {
    let resu = false;
    for (let i = 0; i < data.length && !resu; i += 1) {
      resu = data[i].values.length > 0;
    }
    return resu;
  }

  createChartData() {
    const resu = {
      datasets: [],
    };
    for (let i = 0; i < this.model.length; i += 1) {
      const dataset = {};
      dataset.label = this.model[i].label;
      dataset.fill = i === 0 ? 'origin' : '-1';
      dataset.backgroundColor = this.transparentize(this.model[i].color);
      dataset.borderColor = this.model[i].color;
      dataset.data = this.createValues(this.model[i].name);
      resu.datasets.push(dataset);
    }
    return resu;
  }

  createValues(key) {
    const item = this.data.find((i) => i.key === key);
    const resu = [];
    if (item) {
      for (let i = 0; i < item.values.length; i += 1) {
        resu.push({ x: new Date(item.values[i].time), y: item.values[i].value });
      }
    }
    return resu;
  }
}
window.customElements.define('bnb-chart', BnbChart);
