import React from 'react';
import {Row, Col, DatePicker, Radio} from 'antd';
import formatter from '../utils/DateFormatter';

let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

const DateRangeSelector = React.createClass({
    getInitialState(){
      return {
        startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 - (lastDate.getDay() || 7))),
        endTime: formatter.day(lastDate),
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
        startTime: startTime,
        endTime: endTime,
      });
      this.props.onDateChange(startTime, endTime);
    },

    handleDateIntervalChange(e) {
      let startTime = new Date(lastDate);
      let endTime = new Date(lastDate);
      switch (e.target.value) {
        case '7':
          startTime = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 - (lastDate.getDay() || 7));
          break;
        case '30':
          startTime = new Date(new Date(lastDate.getFullYear(), lastDate.getMonth(), 1, 0, 0, 0));
          break;
      }
      this.setState({
        startTime: formatter.day(startTime),
        endTime: formatter.day(endTime),
      });

      this.props.onDateChange(formatter.day(startTime), formatter.day(endTime));
    },
    disabledDate(current){
      // can not select days after today and today
      return current && current.valueOf() >= lastDate;
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
        <Row className="mb15">
          <Col span={4}>
            <RadioGroup defaultValue="7" onChange={this.handleDateIntervalChange}>
              <RadioButton value="0">昨天</RadioButton>
              <RadioButton value="7">{new Date().getDay() === 1 ? '上周' : '本周'}</RadioButton>
              <RadioButton value="30">{new Date().getDate() === 1 ? '上月' : '本月'}</RadioButton>
            </RadioGroup>
          </Col>

          <Col span={9}>
            <RangePicker
              format={formatter.pattern.day}
              value={[formatter.getMomentDate(startTime), formatter.getMomentDate(endTime)]}
              onChange={this.handleDateRangeChange}
              disabledDate={this.disabledDate}
            />
          </Col>
        </Row>
      );
    }
    ,
  })
  ;

export default DateRangeSelector;
