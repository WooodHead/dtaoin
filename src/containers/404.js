import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('../../src/styles/permissionDenied.css');

const permission404 = require('../images/404.png');

export default class Permission404 extends Component {
  render() {
    return (
      <div>
        <div className="contentStyle">
          <img src={permission404} className="imgError"/>
          <p className="explain404">该页面不存在，回 <Link to={{ pathname: '/' }}>首页</Link></p>
        </div>
      </div>
    );
  }
}
