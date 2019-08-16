import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-spinner/paper-spinner';

class BnbBudget extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-block;
      }

      iron-pages {
        width: 100%;
        height: 100%;
      }

      #canvas {
        position:relative;
        width: 100%;
        height: 100%;
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

      #noData span {
        margin-top: -50px;
      }
    </style>

    <iron-pages selected="[[selectedPage]]">
      <div id="loading">
        <span>Loading&nbsp;</span>
        <paper-spinner active></paper-spinner>
      </div>
      <div id="noData"><span>No data</span></div>
      <div id="canvas">
        <canvas id="chart"></canvas>
      </div>
    </iron-pages>
    `;
  }

  static get properties() {
    return {
      chart: {
        notify: true,
      },
      data: {
        type: Object,
      },
      model: {
        type: Object,
      },
      budget: {
        type: Number,
      },
    };
  }

  static get observers() {
    return [
      'updateChart(data.*)',
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('iron-resize', this.onIronResize);
  }

  attached() {
    super.attached();
    this._queue();
  }

  onIronResize() {
    if (this.chart) {
      this.chart.resize();
      this.chart.render(true);
    }
  }

  _measure(cb) {
    function measure() {
      if (this.offsetHeight) {
        cb(true);
      } else {
        cb(false);
      }
    }
    requestAnimationFrame(measure.bind(this));
  }

  _queue() {
    if (this.hasValues(this.data)) {
      this._measure(function(hasHeight) {
        if (hasHeight) {
          this.updateChart();
        }
      }.bind(this));
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

      const ctx = this.$.chart;
      this.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options,
      });
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
