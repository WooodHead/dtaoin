import React, { Component } from 'react';

require('../../src/styles/permissionDenied.css');

const permission403 = require('../images/403.png');

export default class Permission403 extends Component {
  render() {
    return (
      <div>
        <div className="contentStyle">
          <img src={permission403} className="imgError"/>
          <p className="explain403">您没有该功能的访问权限，请联系管理人员分配</p>
        </div>
      </div>
    );
  }
}
