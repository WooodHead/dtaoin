import React, { Component } from 'react';
import { Row, Select } from 'antd';

import LineChart from '../../../components/chart/LineChart';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import DateRangeSelector from './DateRangeSelector';
import Table from './TableCoupon';

const Option = Select.Option;

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
export default class ClassName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      couponItemId: '',
      key: '',
      categories: [],
      series: [],
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() +
        1 - (lastDate.getDay() || 7))),
      endTime: formatter.day(lastDate),
      page: 1,
    };

    [
      'handleChartCouponSelect',
      'handleDateChange',
      'getStatisticCouponItemGrabDays',
      'handleCouponSearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCouponList();
  }

  handleChartCouponSelect(value) {
    const id = value.split('_----_')[1];
    this.setState({ couponItemId: id, key: value });
    this.getStatisticCouponItemGrabDays(id);
  }

  handleCouponSearch(e) {
    const keyword = e.target.value;
    this.setState({ keyword });
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime, endTime }, () => {
      this.getStatisticCouponItemGrabDays(this.state.couponItemId);
    });
  }

  getCouponList() {
    api.ajax({ url: api.coupon.getCouponList() }, data => {
      const { list } = data.res;
      this.setState({
        list,
        key: `${list[0].name}_----_${list[0]._id}`,
        couponItemId: list[0]._id,
      });
      api.isHeadquarters() && this.getStatisticCouponItemGrabDays(list[0]._id);
    });
  }

  getStatisticCouponItemGrabDays(couponItemId) {
    const { startTime, endTime } = this.state;
    api.ajax({ url: api.coupon.statisticCouponItemGrabDays(startTime, endTime, couponItemId) }, data => {
      const { list } = data.res;
      const categories = [];
      const couponDate = [];
      list.map(item => {
        categories.push(item.date);
        couponDate.push(Number(item.content));
      });

      const series = [
        {
          name: '优惠券',
          data: couponDate,
        },
      ];

      this.setState({ categories, series });
    });
  }

  render() {
    const { list, key, categories, series } = this.state;
    const isShow = api.isHeadquarters();
    return (
      <div>
        <div className={isShow ? '' : 'hide'}>
          <Row>
            <label className="label">选择优惠券</label>
            <Select
              placeholder="请选择优惠券"
              showSearch
              style={{ width: 200 }}
              onSelect={this.handleChartCouponSelect}
              value={key}
              size="large"
            >
              {list.map(item => <Option key={`${item.name}_----_${item._id}`}>{item.name}</Option>)}
            </Select>

            <DateRangeSelector
              onDateChange={this.handleDateChange}
            />
          </Row>

          <LineChart
            title={'领取数'}
            unit={'单位(个)'}
            categories={categories}
            series={series}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '200px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
            className={(series[0] && series[0].data.length > 0) ? 'hide' : ''}
          >
            暂无数据
          </div>
        </div>

        <span className="marketing-statistics-count">
          <Table />
        </span>
      </div>
    );
  }
}
