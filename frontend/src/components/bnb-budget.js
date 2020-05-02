import { LitElement, css, html } from 'lit-element';
import '@polymer/paper-spinner/paper-spinner';

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
    return css`
    :host {
      display: inline-block;
    }

    .hidden {
      display: none;
    }

    #loading {
      display: flex;
      width: 100%;
      height: 100%;
      color: #999;
      font-size: 24px;
      align-items: center;
      justify-content: center;
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
    `;
  }

  constructor() {
    super();
    this.selectedPage = 0;
  }

  render() {
    return html`
    <div id="loading" style="${this.renderStyle(0)}">
      <span>Loading&nbsp;</span>
      <paper-spinner active></paper-spinner>
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
    const resizeObserver = new ResizeObserver( () => {
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
        legend: {
          position: 'bottom',
          labels: {
            fontColor: '#fff',
          },
        },
        tooltips: {
          position: 'nearest',
          mode: 'index',
          intersect: false,
          callbacks: {},
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: this.computeTickFormat(chartData),
              displayFormats: {
                hour: 'MMM D hA',
              },
            },
            ticks: {
              fontColor: '#fff',
            },
          }],
          yAxes: [{
            ticks: {
              fontColor: '#fff',
              beginAtZero: true,
            },
          }],
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.budget,
            borderColor: 'white',
            borderWidth: 2,
            label: {
              content: this.budget,
              enabled: true,
            },
          }],
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

  computeTickFormat(chartData) {
    let resu = 'day';
    if (chartData.datasets.length > 0) {
      const dataset = chartData.datasets[0];
      if (dataset.data.length > 0) {
        const first = dataset.data[0].x;
        const last = dataset.data[dataset.data.length - 1].x;
        if ((last - first) < (7 * 24 * 60 * 60 * 1000)) {
          resu = 'hour';
        }
      }
    }
    return resu;
  }
}
window.customElements.define('bnb-budget', BnbBudget);
