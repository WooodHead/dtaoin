import React from 'react';
import { DatePicker } from 'antd';
import DateFormatter from '../../../utils/DateFormatter';

export default class MonthRangeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startMonth: DateFormatter.month(props.startMonth),
      endMonth: DateFormatter.month(props.endMonth),
    };
    this.disabledMonth = this.disabledMonth.bind(this);
  }

  disabledMonth(month) {
    return month.valueOf() > new Date().valueOf();
  }

  render() {
    const MonthPicker = DatePicker.MonthPicker;
    const {
      startMonth,
      endMonth,
      filterAction,
    } = this.props;

    return (
      <div className="mb15">
        <label className="mr15">发放月份:</label>
        <MonthPicker
          disabledDate={this.disabledMonth}
          defaultValue={DateFormatter.getMomentMonth(startMonth)}
          onChange={filterAction.bind(this, 'startMonth')}
          allowClear={false}
        />
        <span className="ml15 mr15">至</span>
        <MonthPicker
          disabledDate={this.disabledMonth}
          defaultValue={DateFormatter.getMomentMonth(endMonth)}
          onChange={this.props.filterAction.bind(this, 'endMonth')}
          allowClear={false}
        />
      </div>
    );
  }
}
