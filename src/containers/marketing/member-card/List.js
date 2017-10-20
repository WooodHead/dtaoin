import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, Row, Col, Input } from 'antd';

import Table from './Table';

import BaseList from '../../../components/base/BaseList';

import api from '../../../middleware/api';

const Option = Select.Option;
const Search = Input.Search;

export default class List extends BaseList {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      status: '-1',
    };

    [
      'handleSearch',
      'handleStatusChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  handleSearch(e) {
    this.setState({ key: e.target.value });
  }

  handleStatusChange(value) {
    this.setState({ status: value, page: 1 });
  }

  render() {
    const { key, status, page } = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={24}>
            <label className="label">搜索套餐卡</label>
            <Search
              onChange={this.handleSearch}
              placeholder="请输入套餐卡名字"
              style={{ width: '300px' }}
              size="large"
            />

            <span className="ml20">状态：</span>
            <Select
              style={{ width: 120 }}
              size="large"
              defaultValue="-1"
              onChange={this.handleStatusChange}
            >
              <Option key="-1" value="-1">全部</Option>
              <Option key="0" value="0">启用中</Option>
              <Option key="1" value="1">未启用</Option>
            </Select>

            <Link
              to={{ pathname: '/marketing/membercard/new' }}
              className={String(api.getLoginUser().cooperationTypeName) === 'TP顶级合伙店'
                ? 'hide'
                : 'pull-right'}
            >
              <Button type="primary">
                创建套餐卡
              </Button>
            </Link>

          </Col>
        </Row>

        <span className="marketing-member-card">
          <Table
            page={page}
            source={api.coupon.getCouponCardTypeList(key, status, { page })}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
