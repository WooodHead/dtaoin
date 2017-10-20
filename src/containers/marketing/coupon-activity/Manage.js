import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Input, Select, Button } from 'antd';

import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';

import Table from './TableManage';

const Search = Input.Search;
const Option = Select.Option;

export default class Manage extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      isShowAll: '1',
    };

    [
      'handleSearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearch(e) {
    const key = e.target.value;
    this.setState({ key });
  }

  render() {
    return (
      <div>
        <Row className="mb20">
          <label className="label">搜索活动</label>
          <Search
            placeholder="请输入搜索文字"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleSearch}
          />
          <Link
            to={{ pathname: '/marketing/coupon-activity/new' }}
            target="_blank"
            className="pull-right"
          >
            <Button type="primary">创建</Button>
          </Link>
        </Row>

        <span className="coupon-activity-manage">
          <Table
            source={api.coupon.couponActivityList(this.state)}
            page={this.state.page}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
