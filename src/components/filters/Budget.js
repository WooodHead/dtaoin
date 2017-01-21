import React from 'react';
import {Select} from 'antd';

export default class AutoIntention extends React.Component {
  render() {
    const Option = Select.Option;

    return (
      <span className="ml15">
        <label className="mr15">购买预算:</label>
        <Select
          defaultValue={this.props.budgetLevel}
          onChange={this.props.filterAction}
          size="large"
          style={{width: 120}}>
          <Option key="-1">全部</Option>
          <Option key="0">10万以下</Option>
          <Option key="1">10-15万</Option>
          <Option key="2">15-20万</Option>
          <Option key="3">20-25万</Option>
          <Option key="4">25-30万</Option>
          <Option key="5">30万以上</Option>
        </Select>
      </span>
    );
  }
}

