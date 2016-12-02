import React, {Component} from 'react'
import {Radio} from 'antd'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
require('../../styles/common.css')

export default class CustomerType extends Component {
  render() {
    return (
      <div className="mb15">
        <label className="mr15">客户类型:</label>
        <RadioGroup defaultValue="0" size="large" onChange={this.props.filterAction}>
          <RadioButton value="0">全部</RadioButton>
          <RadioButton value="1">成交未维保</RadioButton>
          <RadioButton value="2">续保客户</RadioButton>
        </RadioGroup>
      </div>
    )
  }
}

