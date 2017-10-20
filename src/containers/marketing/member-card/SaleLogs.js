import React from 'react';
import { Select, Row, Col, message, Input } from 'antd';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './TableSaleLogs';

const Option = Select.Option;
const Search = Input.Search;

export default class SaleLogs extends BaseList {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      page: 1,
      key: '',                                    // 搜索关键词
      memberCardTypeList: [],                     // 会员卡类型列表
      couponCardId: '',                      // 选中的卡类型
      startDate: formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)),                    // 开始时间
      endDate: formatter.day(now),     // 结束时间
      endOpen: false,
    };

    [
      'handleCardTypeChange',
      'handleSearch',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCouponCardTypeList();
  }

  handleSearch(e) {
    const key = e.target.value;
    if (key.length >= 3) {
      this.setState({ key });
    }
  }

  handleCardTypeChange(value) {
    this.setState({ couponCardId: value, page: 1 });
  }

  getCouponCardTypeList() {
    const url = api.coupon.getCouponCardTypeList('', '-1');
    api.ajax({ url }, data => {
      if (data.code === 0) {
        this.setState({
          memberCardTypeList: data.res.list,
          totalPagination: Number(data.res.total) || 1,
        });
      } else {
        message.error(data.msg);
      }
    }, error => {
      message.error(error);
    });
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  render() {
    const memberCardTypeList = this.state.memberCardTypeList || [];
    const { couponCardId, startDate, endDate, page } = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={24}>
            <Search
              placeholder="请输入手机号、卡号搜索"
              style={{ width: 300, float: 'left' }}
              onChange={this.handleSearch}
              size="large"
            />

            <span className="ml20">套餐卡名称：</span>
            <Select
              style={{ width: 150 }}
              size="large"
              defaultValue={couponCardId}
              onChange={this.handleCardTypeChange}
            >
              <Option value="">全部</Option>
              {
                memberCardTypeList.map(memberCardType => (
                    <Option
                      key={memberCardType._id}
                      value={memberCardType._id}
                    >
                      {memberCardType.name}
                    </Option>
                  ))
              }
            </Select>

            <span className="ml20">开卡日期：</span>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startDate}
              endTime={endDate}
            />
          </Col>

        </Row>

        <span className="marketing-salelogs">
          <Table
            page={page}
            source={api.coupon.getCouponOrderList(this.state)}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
