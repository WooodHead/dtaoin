import React from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, Select, DatePicker} from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';

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
      type: '-1',
      status: '-2',
      payStatus: '-1',
      endOpen: false,
    };

    [
      'handleSearchChange',
      'handleSearchSelect',
      'handleTypeSelect',
      'handleStatusSelect',
      'handlePayStatusSelect',
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

  handleTypeSelect(type) {
    this.setState({type});
  }

  handleStatusSelect(status) {
    this.setState({status});
  }

  handlePayStatusSelect(payStatus) {
    this.setState({payStatus});
  }

  getSuppliers() {
    api.ajax({url: api.warehouse.supplier.getAll()}, data => {
      this.setState({suppliers: data.res.list});
    });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
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
      startDate,
      endDate,
      type,
      status,
      payStatus,
      suppliers,
      endOpen,
    } = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <label>供应商：</label>
            <Select
              size="large"
              style={{width: 200}}
              defaultValue=""
              showSearch
              optionFilterProp="children"
              onSelect={this.handleSearchSelect}
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

            <label className="ml20">类型：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={type}
              onSelect={this.handleTypeSelect}
            >
              <Option value="-1">全部</Option>
              <Option value="0">常规采购</Option>
              <Option value="1">临时采购</Option>
            </Select>

            <label className="ml20">状态：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={status}
              onSelect={this.handleStatusSelect}
            >
              <Option value="-2">全部</Option>
              <Option value="0">未入库</Option>
              <Option value="-1">已取消</Option>
              <Option value="1">已入库</Option>
            </Select>

            <label className="ml20">结算状态：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={payStatus}
              onSelect={this.handlePayStatusSelect}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未结算</Option>
              <Option value="1">未结清</Option>
              <Option value="2">已结算</Option>
            </Select>

            <div className="pull-right">
              <Button type="primary">
                <Link to={{pathname: '/warehouse/purchase/new'}} target="_blank">采购开单</Link>
              </Button>
            </div>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.warehouse.purchase.list(this.state)}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
