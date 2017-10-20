import React from 'react';
import { Row, Col, Radio, DatePicker, Input } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import DateFormatter from '../../../utils/DateFormatter';
import InfoDropDown from '../../../components/widget/InfoDropDown';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './Table';
import Type from '../part/Type';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Search = Input.Search;
const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      partType: '',
      page: 1,
      type: -1,
      fromType: -1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
      endOpen: false,
      enterPartInfo: '',
    };

    [
      'handleTypeChange',
      'handlePartTypeChange',
      'handleFromTypeChange',
      'handleSearchChange',
      'handleScopeChange',
      'handleBrandChange',
      'handleCheckPart',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(e) {
    this.setState({ keyword: e.target.value, page: 1 });
  }

  handleBrandChange(e) {
    this.setState({ brand: e.target.value, page: 1 });
  }

  handleScopeChange(e) {
    this.setState({ scope: e.target.value, page: 1 });
  }

  handlePartTypeChange(value) {
    this.setState({ partType: value, page: 1 });
  }

  handleTypeChange(e) {
    this.setState({ type: e.target.value, page: 1 });
  }

  handleFromTypeChange(e) {
    this.setState({ fromType: e.target.value, page: 1 });
  }

  handleCheckPart(enterPartInfo) {
    this.setState({ enterPartInfo });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  render() {
    const { startDate, endDate, enterPartInfo } = this.state;

    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo} />

        <Row className="mb10">
          <label className="label" style={{ marginLeft: '13px' }}>搜索配件</label>
          <Search
            onChange={this.handleSearchChange}
            size="large"
            style={{ width: 341 }}
            placeholder="请输入配件名、配件号或首字母搜索"
          />

          <label className="ml20 label">配件分类</label>
          <Type
            onSuccess={this.handlePartTypeChange}
            style={{ width: '185px', display: 'inlink-block' }}
          />

          <label className="label" style={{ marginLeft: '48px' }}>品牌</label>
          <Search
            onChange={this.handleBrandChange}
            size="large"
            style={{ width: 180 }}
            placeholder="全部"
          />
        </Row>

        <Row className="mb10">
          <div className="pull-left mr20">
            <label className="label">出入库时间</label>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startDate}
              endTime={endDate}
            />
          </div>

          <label className="label" style={{ marginLeft: '28px' }}>类型</label>
          <RadioGroup defaultValue="-1" size="large" onChange={this.handleTypeChange}>
            <RadioButton value="-1">全部</RadioButton>
            <RadioButton value="1">入库</RadioButton>
            <RadioButton value="0">出库</RadioButton>
          </RadioGroup>

          <label className="ml20 label">适用车型</label>
          <Search
            onChange={this.handleScopeChange}
            size="large"
            style={{ width: 180 }}
            placeholder="全部"
          />
        </Row>
        <Row className="head-action-bar-line mb10">
          <label className="label" style={{ marginLeft: '42px' }}>单据</label>
          <RadioGroup defaultValue="-1" size="large" onChange={this.handleFromTypeChange}>
            <RadioButton value="-1">全部</RadioButton>
            <RadioButton value="2">采购</RadioButton>
            <RadioButton value="5">退货</RadioButton>
            <RadioButton value="4">销售</RadioButton>
            <RadioButton value="3">工单</RadioButton>
            <RadioButton value="1">盘点</RadioButton>
            <RadioButton value="6">耗材领用</RadioButton>
          </RadioGroup>
        </Row>

        <span className="log-index">
          <Table
            source={api.warehouse.stocktaking.stockLogs(this.state)}
            page={this.state.page}
            updateState={this.updateState}
            onCheckPart={this.handleCheckPart}
          />
        </span>
      </div>
    );
  }
}
