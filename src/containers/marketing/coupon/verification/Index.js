import React from 'react';
import { Tabs } from 'antd';

import Verificate from './Verificate';
import Record from './Record';

const TabPane = Tabs.TabPane;

require('../../coupon-verification.less');

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="优惠券核销" key="1">
            <Verificate />
          </TabPane>
          <TabPane tab="核销记录" key="2">
            <Record />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
