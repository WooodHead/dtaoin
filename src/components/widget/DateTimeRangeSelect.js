import React from 'react';
import { DatePicker } from 'antd';

import formatter from '../../utils/DateFormatter';

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class DateRangeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      endTime: null,
      value: '7',
      endOpen: false,
      isDefaultValue: false,
    };

    [
      'handleDateRangeChange',
      'handleStartTimeChange',
      'handleEndTimeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'disabledEndDate',
      'disabledEndDateCurrent',
      'disabledEndTime',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { isDefaultValue } = this.state;
    if (!isDefaultValue && nextProps.startTime && nextProps.endTime) {
      this.setState({
        startTime: nextProps.startTime ? formatter.date(nextProps.startTime) : null,
        endTime: nextProps.endTime ? formatter.date(nextProps.endTime) : null,
        isDefaultValue: true,
      });
    }
  }

  handleDateRangeChange(value, dateString) {
    let startTime = dateString[0],
      endTime = dateString[1];
    this.setState({
      startTime,
      endTime,
      value: '',
    });
    this.props.onDateChange(startTime, endTime);
  }

  handleStartTimeChange(value) {
    this.setState({ startTime: formatter.date(value) });
  }

  handleEndTimeChange(value) {
    this.setState({ endTime: formatter.date(value), value: '' }, () => {
      const { startTime, endTime } = this.state;
      this.props.onDateChange(startTime, endTime);
    });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    const { startTime } = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startTime));
  }

  disabledEndDateCurrent(current) {
    const { startTime } = this.state;
    return current && (current.valueOf() <= new Date(startTime));
  }

  disabledEndTime() {
    const endTime = new Date(this.state.endTime);
    const now = new Date();

    if (endTime < now) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      return {
        disabledHours: () => this.range(0, hours),
        disabledMinutes: () => this.range(0, minutes),
        disabledSeconds: () => this.range(0, seconds),
      };
    }
    return null;
  }

  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  render() {
    const { startTime, endTime, endOpen } = this.state;
    const { isDisabled } = this.props;
    return (
      <span>
        <DatePicker
          disabledDate={isDisabled === 'false' ? null : this.disabledStartDate}
          format={formatter.pattern.date}
          value={startTime ? formatter.getMomentDate(startTime) : null}
          onChange={this.handleStartTimeChange}
          onOpenChange={this.handleStartOpenChange}
          allowClear={false}
          showTime
          showToday={false}
          size="large"
          style={{ width: '170px' }}
        /> - <DatePicker
        disabledDate={isDisabled === 'false' ? this.disabledEndDateCurrent : this.disabledEndDate}
        disabledTime={this.disabledEndTime}
        format={formatter.pattern.date}
        value={endTime ? formatter.getMomentDate(endTime) : null}
        onChange={this.handleEndTimeChange}
        open={endOpen}
        onOpenChange={this.handleEndOpenChange}
        allowClear={false}
        showTime
        showToday={false}
        size="large"
        style={{ width: '170px' }}
      />
      </span>
    );
  }
}
