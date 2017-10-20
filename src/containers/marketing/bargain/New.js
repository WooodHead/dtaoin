import React from 'react';
import { Tabs } from 'antd';

import BasicInfo from './BasicInfo';
import CommissionInfo from './CommissionInfo';
import DeliveryActivity from './DeliveryActivity';

const TabPane = Tabs.TabPane;
require('../coupon-activity.less');

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      activityId: props.match.params.id || '',
      isDelivery: false,
    };
    [
      'handleTabsChange',
      'handleActivityChange',
      'handleActivityId',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    if (!!this.state.activityId) {
      this.setState({ isDelivery: true });
    }
  }

  handleTabsChange(value) {
    this.setState({ activeKey: value });
  }

  handleActivityChange(value) {
    this.setState({ activeKey: value });
  }

  handleActivityId(id) {
    this.setState({ activityId: id });
  }

  render() {
    const { activeKey, activityId, isDelivery } = this.state;

    const deliveryContent = (
      <TabPane tab="投放活动" key="3" disabled={!activityId}>
        <DeliveryActivity activityId={activityId} />
      </TabPane>
    );

    const tabPaneContent = [
      <TabPane tab="基础信息" key="1">
        <BasicInfo
          onActivityKeyChange={this.handleActivityChange}
          activityId={activityId}
        />
      </TabPane>,
      <TabPane tab="提成信息" key="2" disabled={!activityId}>
        <CommissionInfo activityId={activityId} />
      </TabPane>,
    ];

    if (!!isDelivery) {
      tabPaneContent.push(deliveryContent);
    }

    return (
      <div className="marketing-bargain">
        <Tabs activeKey={activeKey} type="card" onChange={this.handleTabsChange}>
          {tabPaneContent}
        </Tabs>
      </div>
    );
  }
}
