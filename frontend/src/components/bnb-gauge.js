import { LitElement, css, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

class BnbGauge extends LitElement {
  static get properties() {
    return {
      score: { type: Number },
      lastScore: { type: Number },
    };
  }

  static get styles() {
    return css`
    :host {
      --score-container-padding: 2px;
      --color-fail: #ff4e42;
      --color-pass: #0cce6b;
      --color-average: #ffa400;
      --color-not-applicable: #9e9e9e;
      --gauge-circle-size: 36px;
      font-weight: bold;
    }

    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;
      text-decoration: none;
      padding: var(--score-container-padding);
      --transition-length: 1s;
      contain: content;
      will-change: opacity;
    }

    .pass {
      color: var(--color-pass);
      fill: var(--color-pass);
      stroke: var(--color-pass);
    }
    
    .average {
      color: var(--color-average);
      fill: var(--color-average);
      stroke: var(--color-average);
    }
    
    .fail {
      color: var(--color-fail);
      fill: var(--color-fail);
      stroke: var(--color-fail);
    }
    
    .not-applicable {
      color: var(--color-not-applicable);
      fill: var(--color-not-applicable);
      stroke: var(--color-not-applicable);
    }
    
    .svg-wrapper {
      position: relative;
      height: var(--gauge-circle-size);
    }

    .gauge {
        stroke-linecap: round;
        width: var(--gauge-circle-size);
        height: var(--gauge-circle-size);
    }
    
    .gauge-base {
      opacity: 0.1;
    }

    .gauge-arc {
      fill: none;
      transform-origin: 50% 50%;
      animation: load-gauge var(--transition-length) ease forwards;
      animation-delay: 250ms;
    }

    .percentage {
      width: 100%;
      height: var(--gauge-circle-size);
      position: absolute;
      font-size: calc(var(--gauge-circle-size) * 0.34 + 1.3px);
      font-weight: bold;
      line-height: 0;
      text-align: center;
      top: calc(var(--score-container-padding) + var(--gauge-circle-size) / 2);
    }
    `;
  }

  renderClass(value) {
    if (!this.isValid(value)) {
      return { wrapper: true, 'not-applicable': true };
    }

    if (value < 50) {
      return { wrapper: true, fail: true };
    }

    if (value < 80) {
      return { wrapper: true, average: true };
    }

    return { wrapper: true, pass: true };
  }

  render() {
    return html`
      <div class=${classMap(this.renderClass(this.score))} title="${this.renderTooltip()}">
        <div class="svg-wrapper" >
          <svg viewBox="0 0 120 120" class="gauge">
            <circle class="gauge-base" r="56" cx="60" cy="60" stroke-width="8"></circle>
            <circle class="gauge-arc" r="56" cx="60" cy="60" stroke-width="8" style="transform: rotate(-87.9537deg); stroke-dasharray: ${this.computeRotation()}, 351.858;"></circle>
          </svg>
        </div>
        <div class="percentage">
          <small>${this.renderTendancy()}</small>${this.renderScore()}
        </div>
      </div>
    `;
  }

  renderTooltip() {
    if (!this.isValid(this.score)) {
      return 'No lighthouse score to display yet';
    }
    let result = `This week mean lighthouse score is ${this.score}. `;

    if (this.isValid(this.lastScore)) {
      if (this.lastScore < this.score) {
        const delta = this.score - this.lastScore;
        if (delta === 1) {
          result += `It has increased by ${delta} point since last week.`;
        } else {
          result += `It has increased by ${delta} points since last week.`;
        }
      } else if (this.lastScore > this.score) {
        const delta = this.lastScore - this.score;
        if (delta === 1) {
          result += `It has decreased by ${delta} point since last week.`;
        } else {
          result += `It has decreased by ${delta} points since last week.`;
        }
      } else {
        result += 'It hasn\'t changed since last week.';
      }
    }

    return result;
  }

  renderTendancy() {
    if (this.isValid(this.lastScore)) {
      if (this.lastScore < this.score) {
        return '▴';
      } if (this.lastScore > this.score) {
        return '▾';
      }
    }
    return '';
  }

  renderScore() {
    if (!this.isValid(this.score)) {
      return '-';
    }
    return this.score;
  }

  isValid(value) {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return false;
    }
    return true;
  }

  computeRotation() {
    if (!this.isValid(this.score)) {
      return 360;
    }
    return 3.6 * this.score;
  }
}

window.customElements.define('bnb-gauge', BnbGauge);
