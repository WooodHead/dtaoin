import React, { Component } from 'react';
import { Row, Select } from 'antd';

import LineChart from '../../../components/chart/LineChart';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import DateRangeSelector from './DateRangeSelector';
import Table from './TableActivity';

const Option = Select.Option;

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
export default class ClassName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      activityId: '',
      key: '',
      categories: [],
      series: [],
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 - (lastDate.getDay() || 7))),
      endTime: formatter.day(lastDate),
      page: 1,
    };

    [
      'handleChartActivitySelect',
      'handleDateChange',
      'getStatisticActivityItemGrabDays',
      'handleActivitySearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getActivityList();
  }

  handleChartActivitySelect(value) {
    const id = value.split('_----_')[1];
    this.setState({ activityId: id, key: value });
    this.getStatisticActivityItemGrabDays(id);
  }

  handleActivitySearch(e) {
    const keyword = e.target.value;
    this.setState({ keyword });
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime, endTime }, () => {
      this.getStatisticActivityItemGrabDays(this.state.activityId);
    });
  }

  getActivityList() {
    api.ajax({ url: api.coupon.getCouponActivityList() }, data => {
      const { list } = data.res;
      this.setState({ list, key: `${list[0].name}_----_${list[0]._id}`, activityId: list[0]._id });
      this.getStatisticActivityItemGrabDays(list[0]._id);
    });
  }

  getStatisticActivityItemGrabDays(activityId) {
    const { startTime, endTime } = this.state;

    const categories = [];
    const series = [];

    api.ajax({ url: api.coupon.statisticActivityViewDays(startTime, endTime, activityId) }, data => {
      const { list } = data.res;
      const couponDate = [];
      list.map(item => {
        categories.push(item.date);
        couponDate.push(Number(item.content));
      });

      series.push({ name: '查看数', data: couponDate });

      this.setState({ categories, series });
    });


    api.ajax({ url: api.coupon.statisticActivityGrabDays(startTime, endTime, activityId) }, data => {
      const { list } = data.res;
      const couponDate = [];
      list.map(item => {
        couponDate.push(Number(item.content));
      });

      series.push({ name: '领取数', data: couponDate, color: 'green' });

      this.setState({ series });
    });
  }

  render() {
    const { list, key, categories, series } = this.state;
    return (
      <div>
        <Row>
          <label className="label">选择活动</label>
          <Select
            placeholder="请选择优惠券"
            showSearch
            style={{ width: 200 }}
            onSelect={this.handleChartActivitySelect}
            value={key}
          >
            {list.map(item => <Option key={`${item.name}_----_${item._id}`}>{item.title}</Option>)}
          </Select>

          <DateRangeSelector
            onDateChange={this.handleDateChange}
          />
        </Row>

        <LineChart
          title={''}
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

        <Table/>
      </div>
    );
  }
}
