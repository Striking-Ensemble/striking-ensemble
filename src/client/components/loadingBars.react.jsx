import React from 'react';

export default () =>
  <svg width="100px" height="15px" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-bars" style={{"background": "none"}}>
    <rect ng-attr-x="{{config.x1}}" y="5" ng-attr-width="{{config.width}}" height="90" fill="#aaa8a1" x="-35" width="20">
      <animate attributeName="opacity" calcMode="spline" values="1;0.2;1" keyTimes="0;0.5;1" dur="0.7" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.42s" repeatCount="indefinite">
      </animate>
    </rect>
    <rect ng-attr-x="{{config.x2}}" y="5" ng-attr-width="{{config.width}}" height="90" fill="#f4f2ea" x="-5" width="20">
      <animate attributeName="opacity" calcMode="spline" values="1;0.2;1" keyTimes="0;0.5;1" dur="0.7" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.27999999999999997s" repeatCount="indefinite">
      </animate>
    </rect>
    <rect ng-attr-x="{{config.x3}}" y="5" ng-attr-width="{{config.width}}" height="90" fill="#e6cb6b" x="25" width="20">
      <animate attributeName="opacity" calcMode="spline" values="1;0.2;1" keyTimes="0;0.5;1" dur="0.7" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.13999999999999999s" repeatCount="indefinite">
      </animate>
    </rect>
    <rect ng-attr-x="{{config.x4}}" y="5" ng-attr-width="{{config.width}}" height="90" fill="#b88d17" x="55" width="20">
      <animate attributeName="opacity" calcMode="spline" values="1;0.2;1" keyTimes="0;0.5;1" dur="0.7" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite">
      </animate>
    </rect>
  </svg>
