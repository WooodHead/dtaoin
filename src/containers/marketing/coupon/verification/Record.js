import React from 'react';
import { Row, Input } from 'antd';

import api from '../../../../middleware/api';
import BaseList from '../../../../components/base/BaseList';
import DateRangeSelector from '../../../../components/widget/DateRangeSelector';
import DateFormatter from '../../../../utils/DateFormatter';

import Table from './TableRecord';

const Search = Input.Search;

export default class Record extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      startDate: DateFormatter.date(DateFormatter.getLatestMonthStart()).split(' ')[0],
      endDate: DateFormatter.date(new Date()).split(' ')[0],
      page: 1,
      phone: '',
      couponItemName: '',
    };

    [
      'handleIphoneSearch',
      'handleDateChange',
      'handleCouponSearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleIphoneSearch(e) {
    const value = e.target.value;
    this.setState({ phone: value });
  }

  handleCouponSearch(e) {
    const value = e.target.value;
    this.setState({ couponItemName: value });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  render() {
    const { startDate, endDate, page } = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <label className="label">用户</label>
          <Search
            placeholder="请输入手机号搜索"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleIphoneSearch}
          />

          <label className="label ml20">优惠券名称</label>
          <Search
            placeholder="请输入优惠券名称搜索"
            style={{ width: 200 }}
            size="large"
            onChange={this.handleCouponSearch}
          />

          <label className="ml20 label">核销时间</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={startDate}
            endTime={endDate}
          />
        </Row>

        <span className="marketing-sms-recharge">
          <Table
            page={page}
            source={api.coupon.couponItemConsumeSelfList(this.state)}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
