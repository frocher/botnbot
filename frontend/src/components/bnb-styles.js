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
    --mdc-theme-warning: #f57c00;
    --mdc-theme-success: #4bb543;
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

    --wc-range-datepicker-cell-hover: var(--mdc-theme-primary);
    --wc-range-datepicker-cell-selected: var(--mdc-theme-primary);
    --wc-range-datepicker-cell-hovered: #2196F3;

    --fulfilling-bouncing-circle-spinner-color: var(--mdc-theme-primary);

    --bnb-divider-color: #B6B6B6;
  }

  bnb-textfield {
    --mdc-theme-primary: #fff;
  }

  mwc-button {
    --mdc-theme-primary: #64B5F6;
  }

  mwc-linear-progress {
    width: 100%;
    --mdc-theme-primary: #64B5F6;
  }

  mwc-select {
    --mdc-theme-primary: #64B5F6;
  }

  mwc-switch {
    --mdc-theme-surface: var(--mdc-theme-text-primary-on-background);
    --mdc-theme-on-surface: var(--mdc-theme-text-primary-on-background);
  }

  mwc-tab-bar {
    --mdc-theme-primary: #64B5F6;
  }

  mwc-textfield {
    --mdc-theme-primary: #fff;
  }

  mwc-top-app-bar-fixed {
    --mdc-theme-primary: #212121;
    --mdc-theme-on-primary: #fff;
  }
  `;
