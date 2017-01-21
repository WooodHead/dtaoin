import React, {Component} from 'react';
import {Button} from 'antd';
import api from '../middleware/api';

let logoImage = require('../images/apptoc.png');

export default class AppDownloadtoC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ios_url: '',
      android_url: '',
    };
    [
      'getAppTocDownloadUrl',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getAppTocDownloadUrl();
  }

  getAppTocDownloadUrl() {
    api.ajax({url: api.system.getAppTocDownloadUrl(), permission: 'no-login'}, (data) => {
      let url = data.res.url;
      this.setState({
        ios_url: url.ios ? url.ios : this.state.ios_url,
        android_url: url.android ? url.android : this.state.android_url,
      });
    });
  }

  render() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    let url = this.state.ios_url.url;
    if (isAndroid) {
      url = this.state.android_url.url;
    }
    return (
      <div className="margin-top-40">
        <div className="center">
          <img src={logoImage}/>
          <h4>水稻客户版</h4>
          <a href={url}><Button>下载</Button></a>
        </div>

      </div>
    );
  }
}
