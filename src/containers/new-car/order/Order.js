import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Input, Cascader, Row, Select } from 'antd';

import BaseList from '../../../components/base/BaseList_';

import Table from './TableOrder';

import {
  getOrders,
  getProvinces,
  getRegin,
  getCompanyList,
  getProductListAll,

  setPage,
  setKey,
  setProvince,
  setCountry,
  setCity,
  setCompanyId,
  setStartDate,
  setEndDate,
  setProductId,
  setType,
  setStatus,
} from '../../../reducers/new-car/order/orderActions';

import DateRangeSelector from '../../../components/widget/DateRangeSelector';

const Search = Input.Search;
const Option = Select.Option;

class Order extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      listName: 'getOrders',
      paramsChange: [
        'page',
        'searchKey',
        'country',
        'companyId',
        'startDate',
        'endDate',
        'productId',
        'type',
        'status'],
    };
    [
      'handleKeySearch',
      'handleProductChange',
      'getRegin',
      'handleRegionChange',
      'handleCompanyChange',
      'handleDateChange',
      'handleTypeChange',
      'handleStatusChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    Number(this.props.page) === 1 ? this.getList(this.props) : this.props.actions.setPage(1);

    this.props.actions.getProductListAll();
    this.props.actions.getProvinces();
    this.props.actions.getCompanyList();
  }

  getRegin(selectedOptions) {
    this.props.actions.getRegin(selectedOptions);
  }

  handleKeySearch(e) {
    this.props.actions.setKey(e.target.value);
  }

  handleProductChange(value) {
    this.props.actions.setProductId(value);
  }

  handleCompanyChange(value) {
    this.props.actions.setCompanyId(value);
  }

  handleDateChange(startDate, endDate) {
    this.props.actions.setStartDate(startDate);
    this.props.actions.setEndDate(endDate);
  }

  handleRegionChange(value) {
    value[0] ? this.props.actions.setProvince(value[0]) : this.props.actions.setProvince('');
    value[1] ? this.props.actions.setCity(value[1]) : this.props.actions.setCity('');
    value[2] ? this.props.actions.setCountry(value[2]) : this.props.actions.setCountry('');
  }

  handleTypeChange(value) {
    this.props.actions.setType(value);
  }

  handleStatusChange(value) {
    this.props.actions.setStatus(value);
  }

  render() {
    const { options, startDate, endDate, isFetching, page, list, total, productList, companyList } = this.props;

    return (
      <div>
        <Row className="mb10">
          <label className="label" style={{ marginLeft: '28px' }}>搜索</label>
          <Search
            placeholder="请搜索姓名，手机号"
            style={{ width: 340 }}
            onChange={this.handleKeySearch}
            size="large"
          />
        </Row>
        <Row className="mb10">
          <label className="label">产品名称</label>
          <Select
            defaultValue="0"
            style={{ width: 340 }}
            size="large"
            onChange={this.handleProductChange}
          >
            <Option value="0">全部</Option>
            {productList.map(item => (<Option key={item._id}>{item.name}</Option>))}
          </Select>

          <label className="label ml20">区域</label>
          <Cascader
            options={options}
            loadData={this.getRegin}
            onChange={this.handleRegionChange}
            changeOnSelect
            style={{ width: 200 }}
            placeholder="请选择地区"
            size="large"
          />

          <label className="label ml20">门店名称</label>
          <Select
            defaultValue="0"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleCompanyChange}
          >
            <Option value="0">全部</Option>
            {companyList.map(item => (<Option key={item._id}>{item.name}</Option>))}
          </Select>
        </Row>

        <Row className="mb20">
          <label className="label">创建时间</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={startDate}
            endTime={endDate}
          />

          <label className="label ml20">类型</label>
          <Select
            defaultValue="-1"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleTypeChange}
          >
            <Option value="-1">全部</Option>
            <Option value="1">固定首尾付</Option>
            <Option value="2">贷款分期</Option>
          </Select>

          <label className="label" style={{ marginLeft: '46px' }}>状态</label>
          <Select
            defaultValue="-2"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleStatusChange}
          >
            <Option value="-2">全部</Option>

            <Option value="-1">交易取消</Option>
            <Option value="0">意向</Option>
            <Option value="1">待进件</Option>
            <Option value="2">进件中</Option>
            <Option value="3">驳回</Option>
            <Option value="4">待交定金</Option>
            <Option value="5">签单中</Option>
            <Option value="6">贷后</Option>
            <Option value="7">交易成功</Option>
          </Select>
        </Row>

        <span className="new-car-order-table">
          <Table
            updatePage={this.updatePage}
            onSuccess={this.handleSuccess}
            isFetching={isFetching}
            page={page}
            list={list}
            total={total}
          />
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, page, list, total, searchKey, province, city, country, companyId, startDate, endDate, productId, type, status, options, productList, companyList } = state.order;
  return {
    isFetching,
    page,
    list,
    total,
    searchKey,
    province,
    city,
    country,
    companyId,
    startDate,
    endDate,
    productId,
    type,
    status,
    options,
    productList,
    companyList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getOrders,
      getProvinces,
      getRegin,
      getCompanyList,
      getProductListAll,

      setPage,
      setKey,
      setProvince,
      setCity,
      setCountry,
      setCompanyId,
      setStartDate,
      setEndDate,
      setProductId,
      setStatus,
      setType,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Order);
