import React from 'react';
import { Tabs } from 'antd';

import Manage from './Manage';
import ParticipateRecord from './ParticipateRecord';
// import api from '../../../middleware/api';

const TabPane = Tabs.TabPane;

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };
    [
      'handleTabsChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (!!id) {
      this.setState({ activeKey: '2' });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { id } = nextProps.match.params;
    if (!!id) {
      this.setState({ activeKey: '2' });
    }
    return true;
  }

  handleTabsChange(value) {
    this.setState({ activeKey: value });
  }

  render() {
    const { activeKey } = this.state;
    const { id } = this.props.match.params;

    return (
      <div>
        <Tabs activeKey={activeKey} onChange={this.handleTabsChange}>
          <TabPane tab="活动管理" key="1">
            <Manage />
          </TabPane>
          <TabPane tab="参与记录" key="2">
            <ParticipateRecord activityId={id}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
