import React, { Component } from 'react';

import DateFormatter from '../../../utils/DateFormatter';

let now = new Date();
// if (String(now.getDay()) === '1') {
now = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - 7));
// }
require('../weekly.less');

export default class DateWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: DateFormatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 -
        (now.getDay() || 7))),
      endTime: DateFormatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() +
        (7 - now.getDay()))),
    };

    [
      'getYearWeek',
      'handleLastWeek',
      'handleNextWeek',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleLastWeek() {
    const { startTime, endTime } = this.state;
    const currentStartTime = DateFormatter.getDate(startTime);
    const currentEndTime = DateFormatter.getDate(endTime);

    const lastWeekStartTime = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(),
      currentStartTime.getDate() - 7);

    const lastWeekEndTime = new Date(currentEndTime.getFullYear(), currentEndTime.getMonth(),
      currentEndTime.getDate() - 7);

    this.setState({
      startTime: DateFormatter.day(lastWeekStartTime),
      endTime: DateFormatter.day(lastWeekEndTime),
    });

    this.props.onWeekChange(DateFormatter.day(lastWeekStartTime));
  }

  handleNextWeek() {
    const { startTime, endTime } = this.state;
    const currentStartTime = DateFormatter.getDate(startTime);
    const currentEndTime = DateFormatter.getDate(endTime);

    const lastWeekStartTime = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(),
      currentStartTime.getDate() + 7);

    const lastWeekEndTime = new Date(currentEndTime.getFullYear(), currentEndTime.getMonth(),
      currentEndTime.getDate() + 7);

    this.setState({
      startTime: DateFormatter.day(lastWeekStartTime),
      endTime: DateFormatter.day(lastWeekEndTime),
    });
    this.props.onWeekChange(DateFormatter.day(lastWeekStartTime));
  }

  getYearWeek() {
    // 获取当天是本年的第几周
    const { startTime } = this.state;

    const current = DateFormatter.getDate(startTime);

    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();

    const dateOne = new Date(year, parseInt(month) - 1, day);
    const dateTwo = new Date(year, 0, 1);

    const d = Math.round((dateOne.valueOf() - dateTwo.valueOf()) / 86400000);

    return { year, index: Math.ceil((d + ((dateTwo.getDay() + 1) - 1)) / 7) };
  }

  getShowDate(startTime, endTime) {
    const startTimeArr = startTime.split('-');
    const endTimeArr = endTime.split('-');
    return `${startTimeArr[1]}.${startTimeArr[2]} ~ ${endTimeArr[1]}.${endTimeArr[2]}`;
  }

  render() {
    const { startTime, endTime } = this.state;
    const dateIndex = this.getYearWeek();

    const endDate = DateFormatter.getDate(endTime);

    return (
      <div>
        <div className="week">
          <a
            style={{ textDecoration: 'none' }}
            href="javascript:;"
            className="last"
            onClick={this.handleLastWeek}
          >
            {'< 上一周'}
          </a>
          <div className="time">
            <h2>{this.getShowDate(startTime, endTime)}</h2>
            <p>{`${dateIndex.year}年第${dateIndex.index}周`}</p>
          </div>
          {
            endDate >= now
              ? <div className="next">没有了</div>
              : <a
              href="javascript:;"
              style={{ textDecoration: 'none' }}
              className="next"
              onClick={this.handleNextWeek}
            >
              {'下一周 >'}
            </a>
          }
        </div>
        <div className="head-action-bar-line mlr-20" />
      </div>
    );
  }
}
