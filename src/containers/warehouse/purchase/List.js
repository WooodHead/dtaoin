import React from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, Select, DatePicker} from 'antd';

import BaseList from '../../../components/base/BaseList';

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
      type: '-1',
      status: '-2',
      payStatus: '-1',
    };

    [
      'handleDateRangeChange',
      'handleSearchChange',
      'handleSearchSelect',
      'handleTypeSelect',
      'handleStatusSelect',
      'handlePayStatusSelect',
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

  handleDateRangeChange(value, dateString) {
    let startDate = dateString[0], endDate = dateString[1];
    this.setState({startDate, endDate});
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

  render() {
    let {
      page,
      startDate,
      endDate,
      type,
      status,
      payStatus,
      suppliers,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={4}>
            {/*<SearchBox*/}
            {/*data={suppliers}*/}
            {/*change={this.handleSearchChange}*/}
            {/*onSelect={this.handleSearchSelect}*/}
            {/*style={{width: 200}}*/}
            {/*propKey="supplier_id"*/}
            {/*propName="supplier_company"*/}
            {/*placeholder="按供货商搜索"*/}
            {/*/>*/}
            <label>供应商：</label>
            <Select
              defaultValue=""
              showSearch
              optionFilterProp="children"
              onSelect={this.handleSearchSelect}
              style={{width: 200}}
              size="large"
              placeholder="选择供应商">
              <Option value="">全部</Option>
              {suppliers.map(supplier => <Option key={supplier._id}>{supplier.supplier_company}</Option>)}
            </Select>
          </Col>
          <Col span={20}>
            <label>开单日期：</label>
            <RangePicker
              size="large"
              format={DateFormatter.pattern.day}
              defaultValue={[DateFormatter.getMomentDate(startDate), DateFormatter.getMomentDate(endDate)]}
              onChange={this.handleDateRangeChange}
            />

            <label className="ml15">类型：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={type}
              onSelect={this.handleTypeSelect}
            >
              <Option value="-1">全部</Option>
              <Option value="0">采购单</Option>
              <Option value="1">退货单</Option>
            </Select>

            <label className="ml15">状态：</label>
            <Select
              size="large"
              style={{width: 100}}
              defaultValue={status}
              onSelect={this.handleStatusSelect}
            >
              <Option value="-2">全部</Option>
              <Option value="0">未入库</Option>
              <Option value="-1">去取消</Option>
              <Option value="1">已入库</Option>
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
                <Link to={{pathname: '/warehouse/purchase/new'}}>采购开单</Link>
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
