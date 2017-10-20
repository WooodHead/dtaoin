import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Icon, Tabs } from 'antd';

import classNames from 'classnames';

import api from '../../../middleware/api';

import Recharge from './Recharge';
import HistoryDetail from './HistoryDetail';
import SmsRecharge from './SmsRecharge';
import CommonProblem from './CommonProblem';

const TabPane = Tabs.TabPane;

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smsRemain: '',
      activeKey: props.match.params.activeKey,
    };
  }

  componentDidMount() {
    this.getCompanyDetail();
  }

  getCompanyDetail() {
    api.ajax({
      url: api.company.detail(),
    }, data => {
      this.setState({ smsRemain: data.res.company.sms_remain });
    });
  }

  render() {
    const { smsRemain, activeKey } = this.state;

    const remindOne = classNames({
      'ant-alert ant-alert-success mb20': !!smsRemain && Number(smsRemain) > 100,
      hide: Number(smsRemain) <= 100 || !smsRemain,
    });

    const remindTwo = classNames({
      'ant-alert ant-alert-warning mb20': !!smsRemain && Number(smsRemain) <= 100,
      hide: Number(smsRemain) > 100 || !smsRemain,
    });

    return (
      <div>
        <Alert style={{ display: 'none' }} />

        <div className={remindOne} style={{ lineHeight: '30px' }}>
          <Icon type="check-circle" style={{ color: '#00a854' }} />
          <span className="ml10 mr20">{`门店剩余短信 ${smsRemain}条`}</span>
          <Recharge type="1" />
        </div>

        <div className={remindTwo} style={{ lineHeight: '30px' }}>
          <Icon type="exclamation-circle" style={{ color: '#ffbf00' }} />
          <span className="ml10 mr20">{`门店剩余短信 ${smsRemain}条`}</span>
          <Recharge type="2" />
        </div>

        <Tabs type="card" defaultActiveKey={activeKey || '1'}>
          <TabPane tab="历史明细" key="1">
            <HistoryDetail />
          </TabPane>
          <TabPane tab="短信充值" key="2">
            <SmsRecharge />
          </TabPane>
          <TabPane tab="常见问题" key="3">
            <CommonProblem />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
