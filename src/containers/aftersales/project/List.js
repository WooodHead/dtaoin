import React from 'react';
import {Link} from 'react-router';
import {Button, Row, Col, Select, Input} from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;
const Search = Input.Search;

export default class MaintProjectList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      status: '-2',
      pay_status: '-2',
    };

    [
      'handleSearchChange',
      'handleStatusChange',
      'handlePayStatusChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(e) {
    let value = e.target.value;
    if (value.length > 2) {
      this.setState({key: value, page: 1});
    } else if (!value) {
      this.setState({key: '', page: 1});
    }
  }

  handleStatusChange(value) {
    this.setState({status: value, page: 1});
  }

  handlePayStatusChange(value) {
    this.setState({pay_status: value, page: 1});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={18}>
            <span className="mr20">
              <Search
                onChange={this.handleSearchChange}
                size="large"
                style={{width: 250}}
                placeholder="请输入工单号、车牌号、电话搜索"
              />
            </span>

            <label className="mr5">状态:</label>
            <Select
              size="large"
              style={{width: 200}}
              defaultValue="-2"
              onSelect={this.handleStatusChange}
            >
              <Option value="-2">全部</Option>
              <Option value="0">服务中</Option>
              <Option value="1">已完工</Option>
              <Option value="-1">已作废</Option>
            </Select>

            <label className="ml20 mr5">结算状态:</label>
            <Select
              size="large"
              style={{width: 200}}
              defaultValue="-2"
              onSelect={this.handlePayStatusChange}
            >
              <Option value="-2">全部</Option>
              <Option value="0">待付款</Option>
              <Option value="1">挂账</Option>
              <Option value="2">已结算</Option>
            </Select>
          </Col>

          <Col span={6}>
            <div className="pull-right">
              <Link to={{pathname: '/aftersales/project/new'}} target="_blank">
                <Button type="primary" size="default">创建工单</Button>
              </Link>
            </div>
          </Col>
        </Row>

        <Table
          updateState={this.updateState}
          page={this.state.page}
          source={api.aftersales.project.list(this.state)}
        />
      </div>
    );
  }
}
