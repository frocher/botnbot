import { css } from 'lit-element';

// eslint-disable-next-line import/prefer-default-export
export const styles = css`
  :host {
    --mdc-theme-primary: #64B5F6;
    --mdc-theme-secondary: #64B5F6;
    --mdc-theme-surface: #424242;
    --mdc-theme-background: #121212;

    --mdc-theme-on-primary: #212121;
    --mdc-theme-on-secondary: #212121;
    --mdc-theme-on-surface: #fff;

    --mdc-theme-error: #cf6679;
    --mdc-theme-text-primary-on-background: #fff;
    --mdc-theme-text-secondary-on-background: #fff;
    --mdc-theme-text-disabled-on-background: #424242;

    --mdc-dialog-heading-ink-color: var(--mdc-theme-text-primary-on-background);
    --mdc-dialog-content-ink-color: var(--mdc-theme-text-primary-on-background);

    --mdc-radio-unchecked-color: var(--mdc-theme-text-primary-on-background);

    --mdc-ripple-color: #64B5F6;

    --mdc-select-ink-color: var(--mdc-theme-text-primary-on-background);
    --mdc-select-label-ink-color: var(--mdc-theme-text-primary-on-background);
    --mdc-select-focused-label-color: var(--mdc-theme-primary);
    --mdc-select-outlined-idle-border-color: var(--mdc-theme-text-primary-on-background);
    --mdc-select-outlined-hover-border-color: var(--mdc-theme-primary);
    --mdc-select-dropdown-icon-color: var(--mdc-theme-text-primary-on-background);

    --mdc-tab-text-label-color-default: var(--mdc-theme-text-primary-on-background);

    --mdc-text-field-label-ink-color: var(--mdc-theme-text-primary-on-background);
    --mdc-text-field-ink-color: var(--mdc-theme-text-primary-on-background);
    --mdc-text-field-outlined-idle-border-color: var(--mdc-theme-text-primary-on-background);
    --mdc-text-field-outlined-hover-border-color: var(--mdc-theme-secondary);

    --range-datepicker-cell-hover: var(--mdc-theme-primary);
    --range-datepicker-cell-selected: var(--mdc-theme-primary);
    --range-datepicker-cell-hovered: #2196F3;

    --bnb-divider-color: #B6B6B6;
  }

  mwc-textfield {
    --mdc-theme-primary: #fff;
  }

  mwc-button {
    --mdc-theme-primary: #64B5F6;
  }

  mwc-linear-progress {
    width: 100%;
    --mdc-theme-primary: #64B5F6;
  }

  mwc-tab-bar {
    --mdc-theme-primary: #64B5F6;
  }

  `;
