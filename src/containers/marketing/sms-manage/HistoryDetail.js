import React from 'react';
import { Row, Select } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './TableHistoryDetail';

const Option = Select.Option;

export default class HistoryDetail extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      startDate: DateFormatter.date(DateFormatter.getLatestMonthStart()).split(' ')[0],
      endDate: DateFormatter.date(new Date()).split(' ')[0],
      subType: '-1',
      status: '-1',
      page: 1,
    };

    [
      'handleDateChange',
      'handleTypeSelect',
      'handleStatusSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleTypeSelect(subType) {
    this.setState({ subType });
  }

  handleStatusSelect(status) {
    this.setState({ status });
  }

  render() {
    const { startDate, endDate, page } = this.state;
    return (
      <div>
        <Row className="head-action-bar">
          <label className="ml20">发送日期：</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={startDate}
            endTime={endDate}
          />

          <label style={{ marginLeft: '47px' }}>发送状态：</label>
          <Select
            size="large"
            style={{ width: 163 }}
            onSelect={this.handleStatusSelect}
            defaultValue="-1"
          >
            <Option value="-1">全部</Option>
            <Option value="0">发送中</Option>
            <Option value="1">发送成功</Option>
            <Option value="2">发送失败</Option>
          </Select>

          <label className="ml15">短信类型：</label>
          <Select
            size="large"
            style={{ width: 163 }}
            onSelect={this.handleTypeSelect}
            defaultValue="-1"
          >
            <Option value="-1">全部</Option>
            <Option value="201">保养提醒</Option>
            <Option value="202">续保提醒</Option>
            <Option value="203">年检提醒</Option>
            <Option value="204">生日提醒</Option>
            <Option value="205">提车提醒</Option>
            <Option value="206">工单评论</Option>
            <Option value="207">推送优惠券</Option>
            <Option value="208">推送活动</Option>
            <Option value="209">优惠券到账</Option>
            <Option value="210">优惠券到期</Option>
            <Option value="211">套餐卡到期</Option>
          </Select>
        </Row>

        <span className="marketing-sms-recharge">
          <Table
            page={page}
            source={api.coupon.smsConsumeList(this.state)}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
