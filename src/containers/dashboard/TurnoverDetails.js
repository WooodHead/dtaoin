import React from 'react';
import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';
import CurrentDateRangeSelector from '../../components/widget/CurrentDateRangeSelector';
import Table from './TableTurnover';

export default class AftersalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    // 昨天日期
    const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      startTime: props.match.params.startTime ||
      (formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() +
        1 - (lastDate.getDay() || 7)))),
      endTime: props.match.params.endTime || formatter.day(lastDate),
      page: 1,
    };
    [
      'handleDateChange',
      'updateState',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime, endTime, page: 1 });
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const { startTime, endTime } = this.state;

    return (
      <div>
        <CurrentDateRangeSelector
          label="交易时间"
          onDateChange={this.handleDateChange}
          startTime={startTime}
          endTime={endTime}
          notDefault={true}
        />

        <Table
          source={api.statistics.getMaintainTypeDays(this.state)}
          page={this.state.page}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
