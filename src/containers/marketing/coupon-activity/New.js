import React from 'react';
import { Tabs } from 'antd';

import api from '../../../middleware/api';

import SelectType from './SelectType';
import BasicInfo from './BasicInfo';
import CommissionInfo from './CommissionInfo';
import DeliveryActivity from './DeliveryActivity';

const TabPane = Tabs.TabPane;
require('../coupon-activity.less');

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.match.params.id ? '2' : '1',
      type: '0',
      activityId: props.match.params.id || '',
      isDelivery: false,
    };
    [
      'handleTabsChange',
      'handleActivityChange',
      'handleTypeChange',
      'handleActivityId',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { activityId } = this.state;

    if (!!activityId) {
      this.getDetail(activityId);
    }
  }

  handleTabsChange(value) {
    this.setState({ activeKey: value });
  }

  handleActivityChange(value) {
    this.setState({ activeKey: value });
  }

  handleTypeChange(type) {
    this.setState({ type: String(type) });
  }

  handleActivityId(id) {
    this.setState({ activityId: id });
  }

  getDetail(id) {
    api.ajax({
      url: api.coupon.couponActivityDetail({ id }),
    }, data => {
      const { detail } = data.res;
      if (String(detail.is_pay_send) === '1' && String(detail.is_show_qr) === '0') {
        this.setState({ isDelivery: false });
      } else {
        this.setState({ isDelivery: true });
      }
    });
  }

  render() {
    const { activeKey, activityId, type, isDelivery } = this.state;

    const deliveryContent = (
      <TabPane tab="投放活动" key="4" disabled={!type || !activityId}>
        <DeliveryActivity activityId={activityId} />
      </TabPane>
    );

    const tabPaneContent = [
      <TabPane tab="选择类型" key="1">
        <SelectType
          onActivityKeyChange={this.handleActivityChange}
          onTypeChange={this.handleTypeChange}
          onActivityIdGet={this.handleActivityId}
          activityId={activityId}
        />
      </TabPane>,

      <TabPane tab="基础信息" key="2" disabled={!type || !activityId}>
        <BasicInfo
          onActivityKeyChange={this.handleActivityChange}
          activityId={activityId}
          type={type}
        />
      </TabPane>,

      <TabPane tab="提成信息" key="3" disabled={!type || !activityId}>
        <CommissionInfo activityId={activityId} />
      </TabPane>,
    ];

    if (!!isDelivery) {
      tabPaneContent.push(deliveryContent);
    }

    return (
      <div className="marketing-coupon-activity">
        <Tabs activeKey={activeKey} type="card" onChange={this.handleTabsChange}>
          {tabPaneContent}
        </Tabs>
      </div>
    );
  }
}
