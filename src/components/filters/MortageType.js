import React, {Component} from 'react';
import {Radio} from 'antd';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class MortageType extends Component {
  render() {
    return (
      <span className="ml15">
        <label className="mr15">按揭意愿:</label>
        <RadioGroup defaultValue="-1" size="large" onChange={this.props.filterAction}>
          <RadioButton value="-1">全部</RadioButton>
          <RadioButton value="1">按揭</RadioButton>
          <RadioButton value="0">一次性</RadioButton>
        </RadioGroup>
      </span>
    );
  }
}

