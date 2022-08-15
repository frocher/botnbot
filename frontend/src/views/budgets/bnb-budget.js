import { LitElement, css, html } from 'lit';
import 'wc-spinners/dist/fulfilling-bouncing-circle-spinner';
import {
  Chart, LineController, TimeScale, PointElement, LineElement, LinearScale, Filler, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import Color from '@kurkle/color';
import { styles } from '../components/bnb-styles';

Chart.register(
  annotationPlugin,
  LineController,
  TimeScale,
  PointElement,
  LineElement,
  LinearScale,
  Filler,
  Tooltip,
);

class BnbBudget extends LitElement {
  static get properties() {
    return {
      selectedPage: { type: Number },
      data: { type: Object },
      model: { type: Object },
      budget: { type: Number },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      :host {
        display: inline-block;
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
        width: 100%;
        height: 100%;
        color: #999;
        font-size: 36px;
        align-items: center;
        justify-content: center;
      }

      #canvas {
        position:relative;
        width: 100%;
        height: 100%;
      }

      #noData span {
        margin-top: -50px;
      }
      `,
    ];
  }

  constructor() {
    super();
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
      <canvas id="chart">
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
        this.chart.destroy();
        this.chart = undefined;
      }

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
            ticks: {
              color: () => '#fff',
            },
            min: 0,
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#fff',
            },
          },
          tooltip: {
            position: 'nearest',
            mode: 'index',
            intersect: false,
          },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: this.budget,
                yMax: this.budget,
                borderColor: 'white',
                borderWidth: 2,
                label: {
                  content: this.budget,
                  enabled: true,
                },
              },
            },
          },
        },
      };

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

  transparentize(color, opacity) {
    const alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Color(color).alpha(alpha).rgbString();
  }

  hasValues(data) {
    return data && data.values && data.values.length > 0;
  }

  createChartData() {
    const resu = {
      datasets: [],
    };
    const dataset = {};
    dataset.label = this.model.label;
    dataset.backgroundColor = this.transparentize(this.model.color);
    dataset.borderColor = this.model.color;
    dataset.fill = true;
    dataset.data = this.createValues(this.model.name);
    resu.datasets.push(dataset);

    return resu;
  }

  createValues() {
    const resu = [];
    for (let i = 0; i < this.data.values.length; i += 1) {
      resu.push({ x: new Date(this.data.values[i].time), y: this.data.values[i].value });
    }
    return resu;
  }
}
window.customElements.define('bnb-budget', BnbBudget);
