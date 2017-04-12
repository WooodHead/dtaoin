import React from 'react';
import {Row, Col, Input, Select} from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import New from './New';
import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      userType: '-1',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
  }

  handleSearchChange(e) {
    let value = e.target.value;
    this.setState({key: value});
  }

  handleUserTypeChange(userType) {
    this.setState({userType});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={12}>
            <Search
              size="large"
              style={{width: 220}}
              onChange={this.handleSearchChange}
              placeholder="请输入姓名搜索"
            />

            <label className="label ml20">账号类型</label>
            <Select
              size="large"
              style={{width: 220}}
              defaultValue="-1"
              onChange={this.handleUserTypeChange}
            >
              <Option value="-1">全部</Option>
              <Option value="1">连锁店管理员</Option>
              <Option value="2">区域管理员</Option>
              <Option value="3">总公司管理员</Option>
            </Select>
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.admin.account.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
