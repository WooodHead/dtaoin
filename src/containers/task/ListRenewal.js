import React from 'react';
import {Row, Col, Select} from 'antd';

import text from '../../config/text';
import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Table from './TableRenewal';

const Option = Select.Option;

export default class ListRenewal extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.location.query.status || 0,
      dueData: text.dueData[0],
      page: 1,
    };

    [
      'handleChangeStatus',
      'handleChangeDueData',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleChangeStatus(value) {
    this.setState({status: value, page: 1});
  }

  handleChangeDueData(value) {
    this.setState({dueData: text.dueData[value], page: 1});
  }

  render() {
    let {dueData, status, page} = this.state;
    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <label>任务状态：</label>
            <Select
              size="large"
              defaultValue={String(status)}
              onSelect={this.handleChangeStatus}
              style={{width: 200}}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未跟进</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已完成</Option>
            </Select>

            <label className="ml20">距离到期：</label>
            <Select
              size="large"
              defaultValue={String(status)}
              onSelect={this.handleChangeDueData}
              style={{width: 200}}
            >
              <Option value="0">{'<15天'}</Option>
              <Option value="1">16-30天</Option>
            </Select>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.task.getRenewalTaskList(dueData, status, page)}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
