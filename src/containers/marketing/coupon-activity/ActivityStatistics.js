import React from 'react';
import { Input } from 'antd';

import api from '../../../middleware/api';
import Table from './TableActivityStatistics';
import BaseList from '../../../components/base/BaseList';

const Search = Input.Search;

export default class ActivityStatistics extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
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
        <div className="mb20">
          <label className="label">选择活动</label>
          <Search
            onChange={this.handleSearch}
            style={{ width: '200px' }}
            placeholder="请选择活动"
            size="large"
          />
        </div>

        <Table
          source={api.coupon.getCouponActivityList(this.state)}
          page={this.state.page}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
