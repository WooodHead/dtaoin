import React, {Component} from 'react'
import {Radio} from 'antd'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class IntentionLevel extends Component {
  render() {
    return (
      <div className="mb15">
        <label className="mr15">意向级别:</label>
        <RadioGroup defaultValue="" size="large" onChange={this.props.filterAction}>
          <RadioButton value="">全部</RadioButton>
          <RadioButton value="H">H</RadioButton>
          <RadioButton value="A">A</RadioButton>
          <RadioButton value="B">B</RadioButton>
          <RadioButton value="C">C</RadioButton>
          <RadioButton value="D">D</RadioButton>
          <RadioButton value="E">E</RadioButton>
        </RadioGroup>
      </div>
    )
  }
}

