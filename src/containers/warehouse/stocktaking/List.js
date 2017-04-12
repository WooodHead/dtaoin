import React from 'react';
import {Row, Col, Button, DatePicker} from 'antd';
import {Link} from 'react-router';

import DateFormatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
      endOpen: false,
    };

    [
      'handleDateRangeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'handleStartTimeChange',
      'handleEndTimeChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateRangeChange(startDate, endDate) {
    this.setState({startDate, endDate});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  handleStartTimeChange(value) {
    this.setState({startDate: DateFormatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endDate: DateFormatter.day(value)});
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let {startDate} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startDate));
  }

  render() {
    let {endOpen, startDate, endDate} = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <Link to={{pathname: '/warehouse/stocktaking/new'}}>
                <Button type={'primary'}>盘点开单</Button>
              </Link>
            </span>
          </Col>
        </Row>

        <Table
          source={api.warehouse.stocktaking.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
