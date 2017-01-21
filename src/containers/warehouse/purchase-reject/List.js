import React from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, Select, DatePicker} from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import Table from './Table';

const RangePicker = DatePicker.RangePicker;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      suppliers: [],
      supplierId: '',
      startDate: DateFormatter.date(DateFormatter.getLatestMonthStart()),
      endDate: DateFormatter.date(new Date()),
      status: '-2',
      payStatus: '-1',
    };

    [
      'handleDateRangeChange',
      'handleSearchChange',
      'handleSearchSelect',
      'handleStatusSelect',
      'handlePayStatusSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
  }

  handleSearchChange(key) {
    api.ajax({url: api.warehouse.supplier.search(key)}, (data) => {
      let {list} = data.res;
      this.setState({suppliers: list});
    });
  }

  handleSearchSelect(supplierId) {
    this.setState({supplierId});
  }

  handleDateRangeChange(value, dateString) {
    let startDate = dateString[0], endDate = dateString[1];
    this.setState({startDate, endDate});
  }

  handleStatusSelect(status) {
    this.setState({status});
  }

  handlePayStatusSelect(payStatus) {
    this.setState({payStatus});
  }

  render() {
    let {
      page,
      startDate,
      endDate,
      status,
      payStatus,
      suppliers,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={4}>
            <SearchBox
              data={suppliers}
              change={this.handleSearchChange}
              onSelect={this.handleSearchSelect}
              style={{width: 200}}
              placeholder="按供货商搜索"
            />
          </Col>
          <Col span={20}>
            <label>开单日期：</label>
            <RangePicker
              size="large"
              format={DateFormatter.pattern.day}
              defaultValue={[DateFormatter.getMomentDate(startDate), DateFormatter.getMomentDate(endDate)]}
              onChange={this.handleDateRangeChange}
            />

            <label className="ml15">状态：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={status}
              onSelect={this.handleStatusSelect}
            >
              <Option value="-2">全部</Option>
              <Option value="0">未出库</Option>
              <Option value="-1">去取消</Option>
              <Option value="1">已出库</Option>
            </Select>

            <label className="ml15">结算状态：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={payStatus}
              onSelect={this.handlePayStatusSelect}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未结算</Option>
              <Option value="1">挂账</Option>
              <Option value="2">已结算</Option>
            </Select>

            <div className="pull-right">
              <Button type="primary">
                <Link to={{pathname: '/warehouse/purchase-reject/new'}}>退货开单</Link>
              </Button>
            </div>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.warehouse.reject.list(this.state)}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
