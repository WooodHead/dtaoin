import React from 'react';
import { Tabs } from 'antd';

import Count from './Count';
import Record from './Record';

const TabPane = Tabs.TabPane;

export default class List extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="优惠券统计" key="1">
            <Count />
          </TabPane>
          <TabPane tab="核销记录" key="2">
            <Record />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
