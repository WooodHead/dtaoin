import React from 'react';
import { Tabs } from 'antd';

import Intention from './Intention';
import Order from './Order';

const TabPane = Tabs.TabPane;

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="订单管理" key="1">
            <Order />
          </TabPane>
          <TabPane tab="意向管理" key="2">
            <Intention />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
