const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="bnb-grid" theme-for="vaadin-grid">
  <template>
    <style>
      /* Cell styles */
      [part~="cell"] ::slotted(vaadin-grid-cell-content) {
        color: rgba(0, 0, 0, var(--dark-primary-opacity));
        font-size: 12px;
        border-right: 1px solid rgba(224, 224, 224, var(--dark-primary-opacity));
      }

      /* Headers and footers */
      [part~="header-cell"] ::slotted(vaadin-grid-cell-content),
      [part~="footer-cell"] ::slotted(vaadin-grid-cell-content),
      [part~="reorder-ghost"] {
        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
        font-size: 14px;
        text-align: center;
        height: auto;
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer);
