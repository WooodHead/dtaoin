import React from 'react';
import { Col, DatePicker, Row, Select } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;

/**
 *  催收款提醒
 */
export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      status: '-1',
      startDate: DateFormatter.day(new Date()),
      endDate: DateFormatter.day(DateFormatter.getMomentNextMonth()),
      page: 1,
      reload: false,
    };

    [
      'onChangeStatus',
      'onSuccess',
      'onStartDateChange',
      'onEndDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  onChangeStatus(value) {
    this.setState({ status: value, page: 1 });
  }

  onSuccess() {
    this.setState({ reload: true });
  }

  onStartDateChange(date, startDate) {
    this.setState({ startDate });
  }

  onEndDateChange(date, endDate) {
    this.setState({ endDate });
  }

  render() {
    const { startDate, endDate, status, page, reload } = this.state;
    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <label>任务状态：</label>
            <Select
              size="large"
              defaultValue={String(status)}
              onSelect={this.onChangeStatus}
              style={{ width: 200 }}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未跟进</Option>
              <Option value="1">跟进中</Option>
              <Option value="2">已完成</Option>
            </Select>

            <label className="ml20">还款时间：</label>
            <DatePicker
              defaultValue={DateFormatter.getMomentDate()}
              format={DateFormatter.pattern.day}
              onChange={this.onStartDateChange}
              placeholder="起始时间"
              size="large"
            /> - <DatePicker
            defaultValue={DateFormatter.getMomentNextMonth()}
            format={DateFormatter.pattern.day}
            onChange={this.onEndDateChange}
            placeholder="结束时间"
            size="large"
          />
          </Col>
        </Row>

        <span className="remind-debt">
          <Table
            page={page}
            source={api.task.getDebtList(startDate, endDate, status, page)}
            updateState={this.updateState}
            onSuccess={this.onSuccess}
            reload={reload}
          />
        </span>
      </div>
    );
  }
}
