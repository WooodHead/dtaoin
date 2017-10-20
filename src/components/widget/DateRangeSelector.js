import React from 'react';
import { DatePicker } from 'antd';

import formatter from '../../utils/DateFormatter';

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);

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
      'disabledStartDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setState({
      startTime: this.props.startTime ? formatter.day(this.props.startTime) : null,
      endTime: this.props.endTime ? formatter.day(this.props.endTime) : null,
    });

    if (!!this.props.disabled) {
      this.setState({ startTime: '', endTime: '' });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isDefaultValue } = this.state;
    if (!isDefaultValue && nextProps.startTime && nextProps.endTime) {
      this.setState({
        startTime: nextProps.startTime ? formatter.day(nextProps.startTime) : null,
        endTime: nextProps.endTime ? formatter.day(nextProps.endTime) : null,
        isDefaultValue: true,
      });
    }

    if (!!nextProps.disabled) {
      this.setState({ startTime: '', endTime: '' });
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
    this.setState({ startTime: formatter.day(value) });
  }

  handleEndTimeChange(value) {
    this.setState({ endTime: formatter.day(value), value: '' }, () => {
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
    if (this.props.earlyTodayDisabled) {
      return current && current.valueOf() <= lastDate;
    }
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let { startTime } = this.state;
    startTime = `${startTime  } 00:00:00`;

    if (this.props.earlyTodayDisabled) {
      return current && ((current.valueOf() <
        new Date(new Date(startTime).setDate(new Date(startTime).getDate()))) ||
        (current.valueOf() < today));
    }

    return current && (current.valueOf() > new Date() || current.valueOf() <=
      new Date(new Date(startTime).setDate(new Date(startTime).getDate())));
  }

  disabledEndDateCurrent(current) {
    const { startTime } = this.state;

    return current &&
      (current.valueOf() < new Date(new Date(startTime).setDate(new Date(startTime).getDate())));
  }

  render() {
    const { startTime, endTime, endOpen } = this.state;
    const { isDisabled, disabled } = this.props;
    return (
      <span>
        <DatePicker
          disabledDate={isDisabled === 'false' ? null : this.disabledStartDate}
          format={formatter.pattern.day}
          value={startTime ? formatter.getMomentDate(startTime) : null}
          onChange={this.handleStartTimeChange}
          onOpenChange={this.handleStartOpenChange}
          allowClear={false}
          disabled={disabled}
          size="large"
        /> - <DatePicker
        disabledDate={isDisabled === 'false' ? this.disabledEndDateCurrent : this.disabledEndDate}
        format={formatter.pattern.day}
        value={endTime ? formatter.getMomentDate(endTime) : null}
        onChange={this.handleEndTimeChange}
        open={endOpen}
        onOpenChange={this.handleEndOpenChange}
        allowClear={false}
        disabled={disabled}
        size="large"
      />
      </span>
    );
  }
}
