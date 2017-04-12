import React from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, Select, DatePicker} from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
// import SearchBox from '../../../components/search/SearchBox';

import Table from './Table';

let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      suppliers: [],
      supplierId: props.params.id || '',
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
      'handleStartTimeChange',
      'handleEndTimeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSuppliers();
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

  handleStartTimeChange(value) {
    this.setState({startDate: DateFormatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endDate: DateFormatter.day(value)});
  }

  handleStatusChange(status) {
    this.setState({status});
  }

  handlePayStatusChange(payStatus) {
    this.setState({payStatus});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  getSuppliers() {
    api.ajax({url: api.warehouse.supplier.getAll()}, data => {
      this.setState({suppliers: data.res.list});
    });
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let {startDate} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startDate));
  }

  render() {
    let {
      page,
      suppliers,
      startDate,
      endDate,
      status,
      payStatus,
      endOpen,
    } = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <label>供应商：</label>
            <Select
              defaultValue=""
              showSearch
              optionFilterProp="children"
              onSelect={this.handleSearchSelect}
              style={{width: 200}}
              size="large"
              placeholder="选择供应商筛选"
            >
              <Option value="">全部</Option>
              {suppliers.map(supplier => <Option key={supplier._id}>{supplier.supplier_company}</Option>)}
            </Select>

            <label className="ml20">开单日期：</label>
            <DatePicker
              disabledDate={this.disabledStartDate}
              format={DateFormatter.pattern.day}
              defaultValue={DateFormatter.getMomentDate(startDate)}
              onChange={this.handleStartTimeChange.bind(this)}
              onOpenChange={this.handleStartOpenChange.bind(this)}
              allowClear={false}
            />
            -
            <DatePicker
              disabledDate={this.disabledEndDate}
              format={DateFormatter.pattern.day}
              defaultValue={DateFormatter.getMomentDate(endDate)}
              onChange={this.handleEndTimeChange.bind(this)}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange.bind(this)}
              allowClear={false}
            />

            <label className="ml20">状态：</label>
            <Select
              size="large"
              style={{width: 150}}
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
              style={{width: 150}}
              defaultValue={payStatus}
              onSelect={this.handlePayStatusChange}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未结算</Option>
              <Option value="2">已结算</Option>
            </Select>

            <div className="pull-right">
              <Button type="primary">
                <Link to={{pathname: '/warehouse/purchase-reject/new'}} target="_blank">退货开单</Link>
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
