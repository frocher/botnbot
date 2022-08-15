import { css } from 'lit';

// eslint-disable-next-line import/prefer-default-export
export const tooltipStyles = css`
    #tooltip {
      visibility: hidden;
      position: absolute;
      background-color: var(--mdc-theme-on-secondary, #333);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: normal;
      z-index: 1060;
      opacity: 0.9;
    }

    #arrow,
    #arrow::before {
      position: absolute;
      width: 8px;
      height: 8px;
      z-index: -1;
    }

    #arrow::before {
      content: '';
      transform: rotate(45deg);
      background: var(--mdc-theme-on-secondary, #333);
    }

    #tooltip[data-popper-placement^='top'] > #arrow {
      bottom: -4px;
    }

    #tooltip[data-popper-placement^='bottom'] > #arrow {
      top: -4px;
    }

    #tooltip[data-popper-placement^='left'] > #arrow {
      right: -4px;
    }

    #tooltip[data-popper-placement^='right'] > #arrow {
      left:
    }
  `;
