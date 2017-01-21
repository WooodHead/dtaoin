import React, {Component} from 'react';
import {Radio} from 'antd';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class CreateTime extends Component {
  render() {
    return (
      <div className="mb15">
        <label className="mr15">创建时间:</label>
        <RadioGroup defaultValue="0" size="large" onChange={this.props.filterAction}>
          <RadioButton value="0">全部</RadioButton>
          <RadioButton value="3">3天</RadioButton>
          <RadioButton value="7">7天</RadioButton>
          <RadioButton value="15">15天</RadioButton>
          <RadioButton value="30">30天</RadioButton>
          <RadioButton value="60">2个月</RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

