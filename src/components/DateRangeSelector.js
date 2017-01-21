import React from 'react';
import {Row, Col, DatePicker, Radio} from 'antd';
import DateFormatter from '../utils/DateFormatter';

let now = new Date();

const DateRangeSelector = React.createClass({
  getInitialState(){
    return {
      startTime: DateFormatter.date(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0)),
      endTime: DateFormatter.date(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)),
    };
  },

  handleDateRangeChange(value, dateString) {
    let startTime = dateString[0], endTime = dateString[1];

    if (this.props.type !== 'day') {
      startTime = dateString[0].concat(' 00:00:00');
      endTime = dateString[1].concat(' 23:59:59');
    }

    this.setState({
      startTime: startTime,
      endTime: endTime,
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
      startTime: DateFormatter.date(startTime),
      endTime: DateFormatter.date(endTime),
    });

    this.props.onDateChange(DateFormatter.date(startTime), DateFormatter.date(endTime));
  },

  render(){
    const RangePicker = DatePicker.RangePicker;
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    let {
      startTime,
      endTime,
    } = this.state;

    return (
      <Row type={'flex'} gutter={16} className="mb15">
        <Col span={this.props.showInterval ? 11 : 22}>
          <Row type={'flex'} justify={'start'}>
            <Col span={6}>
              <div style={{height: 28, lineHeight: '28px'}}>
                <label>{this.props.label}:</label>
              </div>
            </Col>
            <Col span={18}>
              <RangePicker
                format={DateFormatter.pattern.day}
                defaultValue={[DateFormatter.getMomentDate(startTime), DateFormatter.getMomentDate(endTime)]}
                onChange={this.handleDateRangeChange}
              />
            </Col>
          </Row>
        </Col>
        {this.props.showInterval ?
          <Col span={8}>
            <RadioGroup defaultValue="30" onChange={this.handleDateIntervalChange}>
              <RadioButton value="0">今天</RadioButton>
              <RadioButton value="7">7天</RadioButton>
              <RadioButton value="30">30天</RadioButton>
            </RadioGroup>
          </Col>
          : null
        }
      </Row>
    );
  },
});

DateRangeSelector.defaultProps = {
  showInterval: true,
};

export default DateRangeSelector;
