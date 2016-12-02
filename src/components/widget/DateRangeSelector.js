import React from 'react'
import {Row, Col, DatePicker, Radio} from 'antd'
import formatter from '../../middleware/formatter'

let now = new Date();

const DateRangeSelector = React.createClass({
  getInitialState(){
    return {
      startTime: formatter.date(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0)),
      endTime: formatter.date(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59))
    }
  },

  handleDateRangeChange(value, dateString) {
    let startTime = dateString[0].concat(' 00:00:00'),
      endTime = dateString[1].concat(' 23:59:59');
    this.setState({
      startTime: startTime,
      endTime: endTime
    });
    this.props.onDateChange(startTime, endTime);
  },

  handleDateIntervalChange(e) {
    let startTime = new Date(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)),
      endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    switch (e.target.value) {
      case '7':
        startTime = new Date(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0));
        break;
      case '30':
        startTime = new Date(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0));
        break;
    }
    this.setState({
      startTime: formatter.date(startTime),
      endTime: formatter.date(endTime)
    });

    this.props.onDateChange(formatter.date(startTime), formatter.date(endTime));
  },

  render(){
    const RangePicker = DatePicker.RangePicker;
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    let {
      startTime,
      endTime
    } = this.state;
    return (
      <Row className="mb15">
        <Col span="9">
          <label className="mr15">交易时间:</label>
          <RangePicker
            format="yyyy-MM-dd"
            defaultValue={[startTime, endTime]}
            onChange={this.handleDateRangeChange}
          />
        </Col>
        <Col span="8">
          <RadioGroup defaultValue="30" onChange={this.handleDateIntervalChange}>
            <RadioButton value="0">今天</RadioButton>
            <RadioButton value="7">7天</RadioButton>
            <RadioButton value="30">30天</RadioButton>
          </RadioGroup>
        </Col>
      </Row>
    )
  }
});

export default DateRangeSelector;