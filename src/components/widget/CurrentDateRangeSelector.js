import React from 'react';
import { Row, Col, DatePicker, Radio } from 'antd';

import formatter from '../../utils/DateFormatter';
import createReactClass from 'create-react-class';

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

const DateRangeSelector = createReactClass({
  getInitialState() {
    return {
      startTime: this.props.startTime ||
      formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() +
        1 - (lastDate.getDay() || 7))),
      endTime: this.props.endTime || formatter.day(lastDate),
      value: this.props.notDefault ? '' : '7',
      endOpen: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      startTime: formatter.day(nextProps.startTime),
      endTime: formatter.day(nextProps.endTime),
    });
  },

  handleDateRangeChange(value, dateString) {
    let startTime = dateString[0],
      endTime = dateString[1];
    this.setState({
      startTime,
      endTime,
      value: '',
    });
    this.props.onDateChange(startTime, endTime);
  },

  handleStartTimeChange(value) {
    this.setState({ startTime: formatter.day(value) });
  },

  handleEndTimeChange(value) {
    this.setState({ endTime: formatter.day(value), value: '' }, () => {
      const { startTime, endTime } = this.state;
      this.props.onDateChange(startTime, endTime);
    });
  },

  handleDateIntervalChange(e) {
    let startTime = new Date(lastDate);
    const endTime = new Date(lastDate);
    this.setState({ value: '1' });
    switch (e.target.value) {
    case '7':
      startTime = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 -
          (lastDate.getDay() || 7));
      this.setState({ value: '7' });
      break;
    case '30':
      startTime = new Date(new Date(lastDate.getFullYear(), lastDate.getMonth(), 1, 0, 0, 0));
      this.setState({ value: '30' });
      break;
    }
    this.setState({
      startTime: formatter.day(startTime),
      endTime: formatter.day(endTime),
    });

    this.props.onDateChange(formatter.day(startTime), formatter.day(endTime));
  },

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  },

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  },

  /* disabledDate(current){
   return current && current.valueOf() >= lastDate;
   },*/

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  },

  disabledEndDate(current) {
    const { startTime } = this.state;
    return current && (current.valueOf() >= lastDate ||
      current.valueOf() <=
      new Date(new Date(startTime).setDate(new Date(startTime).getDate() - 1)));
  },

  render() {
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    const { startTime, endTime, value, endOpen } = this.state;

    return (
      <Row className="mb15">
        <RadioGroup
          value={value}
          onChange={this.handleDateIntervalChange}
          size="large"
        >
          <RadioButton value="1">昨天</RadioButton>
          <RadioButton value="7">{new Date().getDay() === 1 ? '上周' : '本周'}</RadioButton>
          <RadioButton value="30">{new Date().getDate() === 1 ? '上月' : '本月'}</RadioButton>
        </RadioGroup>

        <label className="label ml20">选择时间</label>
        <DatePicker
          disabledDate={this.disabledStartDate}
          format={formatter.pattern.day}
          value={formatter.getMomentDate(startTime)}
          onChange={this.handleStartTimeChange}
          onOpenChange={this.handleStartOpenChange}
          allowClear={false}
          size="large"
        /> - <DatePicker
        disabledDate={this.disabledEndDate}
        format={formatter.pattern.day}
        value={formatter.getMomentDate(endTime)}
        onChange={this.handleEndTimeChange}
        open={endOpen}
        onOpenChange={this.handleEndOpenChange}
        allowClear={false}
        size="large"
      />
      </Row>
    );
  },
});

export default DateRangeSelector;
