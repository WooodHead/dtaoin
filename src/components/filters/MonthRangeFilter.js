import React from 'react'
import {DatePicker} from 'antd'

export default class MonthRangeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startMonth: props.startMonth,
      endMonth: props.endMonth
    };
    this.disabledMonth = this.disabledMonth.bind(this);
  }

  disabledMonth(month) {
    return month.getTime() > new Date().getTime();
  }

  render() {
    const MonthPicker = DatePicker.MonthPicker;
    let {
      startMonth,
      endMonth,
      filterAction
    } = this.props;

    return (
      <div className="mb15">
        <label className="mr15">发放月份:</label>
        <MonthPicker
          disabledDate={this.disabledMonth}
          defaultValue={startMonth}
          onChange={filterAction.bind(this, 'startMonth')}
        />
        <span className="ml15 mr15">至</span>
        <MonthPicker
          disabledDate={this.disabledMonth}
          defaultValue={endMonth}
          onChange={this.props.filterAction.bind(this, 'endMonth')}
        />
      </div>
    )
  }
}
