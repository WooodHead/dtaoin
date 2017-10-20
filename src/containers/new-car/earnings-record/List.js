import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Row, Select, Cascader } from 'antd';

import DateRangeSelector from '../../../components/widget/DateRangeSelector';
import BaseList from '../../../components/base/BaseList_';

import Table from './Table';

import {
  getEarningsRecordList,
  getResourceList,
  getRegin,
  getProvinces,
  setProvince,
  setCounty,
  setCity,
  setPage,
  setStartDate,
  setEndDate,
  setResourceId,
} from '../../../reducers/new-car/earnings-record/earningsRecordActions';

const Option = Select.Option;

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      listName: 'getEarningsRecordList',
      paramsChange: ['page', 'city', 'country', 'startDate', 'endDate', 'resourceId'],
    };

    [
      'getRegin',
      'handleRegionChange',
      'handleResourceChange',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    Number(this.props.page) === 1 ? this.getList(this.props) : this.props.actions.setPage(1);

    this.props.actions.getProvinces();
    this.props.actions.getResourceList();
  }

  getRegin(selectedOptions) {
    this.props.actions.getRegin(selectedOptions);
  }

  handleRegionChange(value) {
    value[0] ? this.props.actions.setProvince(value[0]) : this.props.actions.setProvince('');
    value[1] ? this.props.actions.setCity(value[1]) : this.props.actions.setCity('');
    value[2] ? this.props.actions.setCounty(value[2]) : this.props.actions.setCounty('');
  }

  handleDateChange(startDate, endDate) {
    this.props.actions.setStartDate(startDate);
    this.props.actions.setEndDate(endDate);
  }

  handleResourceChange(value) {
    this.props.actions.setResourceId(value);
  }

  render() {
    const { options, isFetching, page, list, total, startDate, endDate, resourceList } = this.props;
    return (
      <div>
        <Row className="head-action-bar">
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

          <label className="label ml20">资源方</label>
          <Select
            defaultValue="0"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleResourceChange}
          >
            <Option value="0">全部</Option>
            {resourceList.map(item => <Option key={item._id}>{item.name}</Option>)}
          </Select>

          <label className="label ml20">创建时间</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={startDate}
            endTime={endDate}
          />
        </Row>

        <span className="new-car-earnings-record">
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
  const { isFetching, page, list, total, province, city, country, startDate, endDate, options, resourceList, resourceId } = state.newCarEarningsRecord;
  return {
    isFetching,
    page,
    list,
    total,
    province,
    city,
    country,
    startDate,
    endDate,
    options,
    resourceList,
    resourceId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getEarningsRecordList,
      getResourceList,
      getRegin,
      getProvinces,
      setProvince,
      setCounty,
      setCity,
      setPage,
      setStartDate,
      setEndDate,
      setResourceId,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
