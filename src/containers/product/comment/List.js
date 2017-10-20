import React from 'react';
import { Row, Col, DatePicker } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';
import DateFormatter from '../../../utils/DateFormatter';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      company_id: '',
      company_data: [],
      commentDate: formatter.day(new Date()),
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
    };

    [
      'handleTimeChange',
      'handleSearch',
      'handleSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyList();
  }

  getCompanyList() {
    api.ajax({ url: api.company.list(this.state.page) }, data => {
      const { list } = data.res;
      if (list.length > 0) {
        this.setState({ company_data: list });
      } else {
        this.setState({ company_data: [] });
      }
    });
  }

  handleTimeChange(value, dateString) {
    this.setState({
      commentDate: dateString,
    });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleSearch(key, successHandle, failHandle) {
    const url = api.company.keyList(key);
    api.ajax({ url }, data => {
      const { list } = data.res;
      if (list.length > 0) {
        this.setState({ company_data: list });
      } else {
        this.setState({ company_data: [] });
      }
      successHandle(list);
    }, error => {
      failHandle(error);
    });
  }

  handleSelectItem(selectedItem) {
    this.setState({ value: selectedItem.name, company_id: selectedItem._id });
  }

  render() {
    const { commentDate, startDate, endDate } = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <SearchSelectBox
              style={{ width: 250, float: 'left' }}
              placeholder={'请输入门店名称'}
              onSearch={this.handleSearch}
              onSelectItem={this.handleSelectItem}
            />

            <label className="label ml20">评价时间</label>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startDate}
              endTime={endDate}
            />
          </Col>
        </Row>

        <span className="product-comment">
          <Table
            source={api.comment.list(this.state)}
            page={this.state.page}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
