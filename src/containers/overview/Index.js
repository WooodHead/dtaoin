import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';

import SparkingChart from '../../components/chart/SparkingChart';

import Store from './Store';
import Chain from './Chain';

const TabPane = Tabs.TabPane;

export default class Index extends Component {
  constructor(props) {
    super(props);
    let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      startTime: formatter.day(new Date(new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, lastDate.getDate(), 0, 0, 0))),
      endTime: formatter.day(lastDate),
      summaryDays: '',
      summaryToday: '',
    };

    [].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainSummaryDays();
    this.getMaintainTodaySummary();
  }

  getMaintainSummaryDays() {
    let userType = api.getLoginUser().userType;
    let {startTime, endTime} = this.state;

    let url = null;
    if (Number(userType) == 1) {
      url = api.overview.statistics.getChainMaintainSummaryDays(startTime, endTime);
    } else if (Number(userType) == 3) {
      url = api.overview.statistics.getAllMaintainSummaryDays(startTime, endTime);
    }

    let summaryDays = {};
    summaryDays.maintainCount = [];
    summaryDays.beautyCount = [];
    summaryDays.totalFee = [];
    summaryDays.totalProfit = [];
    summaryDays.memberNew = [];

    api.ajax({url: url}, data => {
      let list = data.res.list;
      list.map(item => {
        summaryDays.maintainCount.push(item.content.maintain_count);
        summaryDays.beautyCount.push(item.content.beauty_count);
        summaryDays.totalFee.push(item.content.total_fee);
        summaryDays.totalProfit.push(item.content.total_profit);
        summaryDays.memberNew.push(item.content.member_new);
      });

      this.setState({summaryDays});
    });
  }

  getMaintainTodaySummary() {
    let userType = api.getLoginUser().userType;

    let url = null;
    if (Number(userType) === 1) {
      url = api.overview.statistics.getChainMaintainTodaySummary();
    } else if (Number(userType) === 3) {
      url = api.overview.statistics.getAllMaintainTodaySummary();
    }

    let summaryToday = {};
    api.ajax({url: url}, data => {
      let list = data.res;
      summaryToday.maintainCount = list.maintain_count.count;
      summaryToday.beautyCount = list.maintain_count.beauty_count;
      summaryToday.totalFee = list.maintain_total_incomes.total_fee;
      summaryToday.totalProfit = list.maintain_total_incomes.total_profit;
      summaryToday.memberNew = list.member_summary.count;

      this.setState({summaryToday});
    });
  }

  render() {
    let {summaryDays, summaryToday} = this.state;

    return (
      <div>
        <Row className="border-color-grey padding-20 padding-top-75 border-radius-4 mb20">
          <Col span={4}>
            <SparkingChart
              data={summaryDays && summaryDays.totalFee || []}
              subtitle="今日营业额"
              title={summaryToday && summaryToday.totalFee || 0}
            />
          </Col>
          <Col span={1}>
            <div className="overview-vertical-line"></div>
          </Col>

          <Col span={4}>
            <SparkingChart
              data={summaryDays && summaryDays.totalProfit || []}
              subtitle="今日毛利润"
              title={summaryToday && summaryToday.totalProfit || 0}
            />
          </Col>
          <Col span={1}>
            <div className="overview-vertical-line"></div>
          </Col>

          <Col span={4}>
            <SparkingChart
              data={summaryDays && summaryDays.maintainCount || []}
              subtitle="今日开单数"
              title={summaryToday && summaryToday.maintainCount || 0}
            />
          </Col>
          <Col span={1}>
            <div className="overview-vertical-line"></div>
          </Col>

          <Col span={4}>
            <SparkingChart
              data={summaryDays && summaryDays.beautyCount || []}
              subtitle="今日洗车数"
              title={summaryToday && summaryToday.beautyCount || 0}
            />
          </Col>
          <Col span={1}>
            <div className="overview-vertical-line"></div>
          </Col>

          <Col span={4}>
            <SparkingChart
              data={summaryDays && summaryDays.memberNew || []}
              subtitle="今日新增会员"
              title={summaryToday && summaryToday.memberNew || 0}
            />
          </Col>
        </Row>

        <Tabs defaultActiveKey="1">
          <TabPane tab="门店管理" key="1">
            <Store />
          </TabPane>

          <TabPane tab="连锁管理" key="2">
            <Chain />
          </TabPane>
        </Tabs>

      </div>
    );
  }
}
