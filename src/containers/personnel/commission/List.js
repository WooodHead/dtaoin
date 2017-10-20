import React from 'react';
import { Row, Col, Input, Radio, DatePicker } from 'antd';

import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';
import formatter from '../../../utils/DateFormatter';

import Table from './Table';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const MonthPicker = DatePicker.MonthPicker;

export default class ClassName extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      department: '',
      month: formatter.month(new Date()),
      key: '',
    };

    [
      'handleSearch',
      'handleDepartmentChange',
      'handleMonthChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearch(e) {
    this.setState({ key: e.target.value });
  }

  handleDepartmentChange(e) {
    this.setState({ department: e.target.value });
  }

  handleMonthChange(value) {
    this.setState({ month: formatter.month(value) });
  }

  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  render() {
    const { page, month } = this.state;
    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <label className="label">搜索名称</label>
            <Search
              style={{ width: '200px' }}
              onChange={this.handleSearch}
              placeholder="请输入员工姓名"
              size="large"
            />

            <label className="label ml20">部门</label>
            <RadioGroup
              defaultValue="0"
              size="large"
              onChange={this.handleDepartmentChange}
            >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="1">总经办</RadioButton>
              <RadioButton value="2">售前</RadioButton>
              <RadioButton value="3">售后</RadioButton>
            </RadioGroup>

            <label className="label ml20">发放月份</label>
            <MonthPicker
              onChange={this.handleMonthChange}
              disabledDate={this.disabledDate}
              size="large"
              defaultValue={formatter.getMomentMonth(month)}
            />
          </Col>
        </Row>

        <span className="personnel-commission">
          <Table
            source={api.user.getSalaryList(this.state)}
            page={page}
            updateState={this.updateState}
            month={month}
          />
        </span>
      </div>
    );
  }
}
