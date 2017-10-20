import React from 'react';
import { Col, Row, Select } from 'antd';

import text from '../../../config/text';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;

/**
 *  套餐卡到期提醒
 */
export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      status: '-1',
      dueDate: text.task.dueDateMin['-1'],
      page: 1,
      reload: false,
    };

    [
      'onChangeStatus',
      'onChangeDueData',
      'onSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  onChangeStatus(value) {
    this.setState({ status: value, page: 1 });
  }

  onChangeDueData(value) {
    this.setState({ dueDate: text.task.dueDateMin[value], page: 1 });
  }

  onSuccess() {
    this.setState({ reload: true });
  }

  render() {
    const { dueDate, status, page, reload } = this.state;
    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <label>状态：</label>
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

            <label className="ml20">距离到期：</label>
            <Select
              size="large"
              defaultValue="-1"
              onSelect={this.onChangeDueData}
              style={{ width: 200 }}
            >
              <Option value="-1">全部</Option>
              <Option value="0">0-15天</Option>
              <Option value="1">16-30天</Option>
            </Select>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.task.getMemberCardExpireList(dueDate, status, page)}
          updateState={this.updateState}
          onSuccess={this.onSuccess}
          reload={reload}
        />
      </div>
    );
  }
}
