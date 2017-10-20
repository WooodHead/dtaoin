import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Select } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      suppliers: [],
      supplierId: props.match.params.id || '',
      startDate: DateFormatter.date(DateFormatter.getLatestMonthStart()),
      endDate: DateFormatter.date(new Date()),
      status: '-2',
      payStatus: '-1',
      endOpen: false,
    };

    [
      'handleSearchChange',
      'handleSearchSelect',
      'handleStatusChange',
      'handlePayStatusChange',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSuppliers();
  }

  handleSearchChange(key) {
    api.ajax({ url: api.warehouse.supplier.search(key) }, data => {
      const { list } = data.res;
      this.setState({ suppliers: list });
    });
  }

  handleSearchSelect(supplierId) {
    this.setState({ supplierId });
  }

  handleStatusChange(status) {
    this.setState({ status });
  }

  handlePayStatusChange(payStatus) {
    this.setState({ payStatus });
  }

  getSuppliers() {
    api.ajax({ url: api.warehouse.supplier.getAll() }, data => {
      this.setState({ suppliers: data.res.list });
    });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  render() {
    const {
      page,
      suppliers,
      startDate,
      endDate,
      status,
      payStatus,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <label>供应商：</label>
            <Select
              defaultValue=""
              showSearch
              optionFilterProp="children"
              onSelect={this.handleSearchSelect}
              style={{ width: 200 }}
              size="large"
              placeholder="选择供应商筛选"
            >
              <Option value="">全部</Option>
              {suppliers.map(supplier => <Option
                key={supplier._id}>{supplier.supplier_company}</Option>)}
            </Select>

            <label className="ml20">开单日期：</label>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startDate}
              endTime={endDate}
            />
          </Col>
        </Row>

        <Row className="head-action-bar-line mb10">
          <label style={{ marginLeft: '14px' }}>状态：</label>
          <Select
            size="large"
            style={{ width: 200 }}
            defaultValue={status}
            onSelect={this.handleStatusChange}
          >
            <Option value="-2">全部</Option>
            <Option value="0">未出库</Option>
            <Option value="-1">已取消</Option>
            <Option value="1">已出库</Option>
          </Select>

          <label className="ml20">结算状态：</label>
          <Select
            size="large"
            style={{ width: 163 }}
            defaultValue={payStatus}
            onSelect={this.handlePayStatusChange}
          >
            <Option value="-1">全部</Option>
            <Option value="0">未结算</Option>
            <Option value="2">已结算</Option>
          </Select>

          <div className="pull-right">
            <Button type="primary">
              <Link
                to={{ pathname: '/warehouse/purchase-reject/new' }}
                target="_blank"
              >
                退货开单
              </Link>
            </Button>
          </div>
        </Row>

        <div className="purchase-reject-index">
          <Table
            page={page}
            source={api.warehouse.reject.list(this.state)}
            updateState={this.updateState}
          />
        </div>
      </div>
    );
  }
}
