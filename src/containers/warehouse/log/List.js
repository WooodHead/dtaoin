import React from 'react';
import {Row, Col, Radio, DatePicker} from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import DateFormatter from '../../../utils/DateFormatter';

import Table from './Table';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      type: -1,
      fromType: -1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
      endOpen: false,
    };

    [
      'handleDateRangeChange',
      'handleTypeChange',
      'handleFromTypeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateRangeChange(startDate, endDate) {
    this.setState({startDate, endDate, page: 1});
  }

  handleStartTimeChange(value) {
    this.setState({startDate: DateFormatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endDate: DateFormatter.day(value)});
  }

  handleTypeChange(e) {
    this.setState({type: e.target.value, page: 1});
  }

  handleFromTypeChange(e) {
    this.setState({fromType: e.target.value, page: 1});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  disabledStartDate(current){
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current){
    let {startDate} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startDate));
  }

  render() {
    let {startDate, endDate, endOpen} = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-left mr20">
              <laber>选择时间：</laber>

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
            </div>

            <label className="mr5">类型:</label>
            <RadioGroup defaultValue="-1" size="large" onChange={this.handleTypeChange}>
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="1">入库</RadioButton>
              <RadioButton value="0">出库</RadioButton>
            </RadioGroup>

            <label className="ml20 mr5">单据:</label>
            <RadioGroup defaultValue="-1" size="large" onChange={this.handleFromTypeChange}>
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="2">采购</RadioButton>
              <RadioButton value="5">退货</RadioButton>
              <RadioButton value="4">销售</RadioButton>
              <RadioButton value="3">工单</RadioButton>
              <RadioButton value="1">盘点</RadioButton>
              <RadioButton value="6">耗材领用</RadioButton>
            </RadioGroup>
          </Col>
        </Row>

        <Table
          source={api.warehouse.stocktaking.logs(this.state)}
          page={this.state.page}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
