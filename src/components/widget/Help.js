import React, {Component} from 'react';
import {Popover} from 'antd';
import className from 'classnames';

import api from '../../middleware/api';

import SwitchCompany from '../../containers/company/SwitchCompany';

require('../../styles/help.less');

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceVisible: false,
      returnVisible: false,
    };

    [
      'handleServiceMouseEnter',
      'handleServiceMouseLeave',
      'handleReturnMouseEnter',
      'handleReturnMouseLeave',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleServiceMouseEnter() {
    this.setState({serviceVisible: true});
  }

  handleServiceMouseLeave() {
    this.setState({serviceVisible: false});
  }

  handleReturnMouseEnter() {
    this.setState({returnVisible: true});
  }

  handleReturnMouseLeave() {
    this.setState({returnVisible: false});
  }

  render() {
    let {serviceVisible, returnVisible} = this.state;
    const userType = api.getLoginUser().userType;
    const companyId = api.getLoginUser().companyId;
    const operationName = api.getLoginUser().operationName;
    const operationPhone = api.getLoginUser().operationPhone;

    let contentVisibility = className({
      'help-content': !(companyId == '1'),
      'hide': companyId == '1',
    });

    let returnBackstageVisibility = className({
      'return-content': ['1', '2', '3'].indexOf(userType) != -1,
      'return-content hide': ['1', '2', '3'].indexOf(userType) == -1,
    });

    let content = (
      <div className="help">
        <div className="help-pic"></div>
        <p>运营负责人: {operationName}</p>
        <p>{operationPhone}</p>
        <p>周一到周六 9:00-19:00</p>
      </div>
    );

    return (
      <div className={contentVisibility}>
        <div className="help-link">
          <Popover
            placement="leftTop"
            title={null}
            content={content}
            trigger="hover"
            overlayStyle={{width: '190px', height: '190px'}}
          >
            <div
              className="link"
              onMouseEnter={this.handleServiceMouseEnter}
              onMouseLeave={this.handleServiceMouseLeave}
            >
              <div className={!!serviceVisible ? 'service' : 'hide'}>
                <p>客服</p>
                <p>支持</p>
              </div>

              <div className={!serviceVisible ? 'person' : 'hide'}></div>
            </div>
          </Popover>
          <div
            className={returnBackstageVisibility}
            onMouseEnter={this.handleReturnMouseEnter}
            onMouseLeave={this.handleReturnMouseLeave}
          >
            <SwitchCompany
              company={{_id: 1}}
              type="help"
              returnVisible={returnVisible}
            />
          </div>
        </div>
      </div>
    );
  }
}
