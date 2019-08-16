import { PolymerElement } from '@polymer/polymer/polymer-element';

class BnbAnalytics extends PolymerElement {
  static get properties() {
    return {
      key: {
        type: String,
        observer: '_keyChanged',
      },
    };
  }

  sendPath(pathname) {
    ga('send', 'pageview', pathname);
  }

  _keyChanged(key) {
    if (key) {
      ga('create', key, 'auto', {
        appName: 'Botnbot',
      });
    }
  }
}
window.customElements.define('bnb-analytics', BnbAnalytics);

/* eslint-disable */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
