import React from 'react';
import { Row, Col, Input } from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';
import IncomeTable from './IncomeTable';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

const Search = Input.Search;

export default class PresalesIncomeList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      start_date: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_date: formatter.date(new Date()),
      pay_type: '',
      plate_num: '',
      from_type: '0',
      status: '0',
      endOpen: false,
    };
    [
      'handleSearchChange',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(e) {
    const key = e.target.value;
    this.setState({ plate_num: key });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ start_date: startDate, end_date: endDate });
  }

  render() {
    const { start_date, end_date } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Search
            onChange={this.handleSearchChange}
            size="large"
            style={{ width: '220px' }}
            placeholder="请输入关键字搜索"
          />
          <label className="mr5 ml20">交易时间:</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={start_date}
            endTime={end_date}
          />
        </Row>

        <span className="income-list">
          <IncomeTable
            updateState={this.updateState}
            currentPage={this.state.page}
            source={api.finance.getPresalesIncomeList(this.state)}
          />
        </span>
      </div>
    );
  }
}
