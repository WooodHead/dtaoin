import React from 'react';
import { Row, Col } from 'antd';
import LineChart from '../../components/chart/LineChart';

require('./dashboard.less');
const img = require('../../images/home/icon1.png');
const money = require('../../images/dashboard/chart_icon_money.png');
const percentage = require('../../images/dashboard/chart_icon_percentage.png');
const list = require('../../images/dashboard/chart_icon_list.png');

export default class AftersalesSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: 'carCount',
    };
    [
      'handleChartData',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleChartData(method, index) {
    this.props.loadChart(method, index);
  }

  render() {
    const {
      chartTitle,
      chartSubtitle,
      chartUnit,
      allowDecimals,
      categories,
      series,
      summaryData,
    } = this.props;

    const { index } = this.props;

    return (
      <div>
        <Row className="dashboard-border">
          <Col className="dashboard-title" span={4}>
            <ul>
              <li
                className={index === '1' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getMaintainIncomeDaysData', '1')}
              >
                <img src={money} />
                <div className="dashboard-number">
                  <p className="font-size-14">营业额</p>
                  <p className="font-size-22">
                    {summaryData.totalFee ? Number(summaryData.totalFee).toFixed(2) : '0.00'}
                  </p>
                </div>
              </li>

              <li
                className={index === '2' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getMaintainProfitDaysDate', '2')}
              >
                <img src={percentage} />
                <div className="dashboard-number">
                  <p className="font-size-14">毛利率</p>
                  <p className="font-size-22">
                    {summaryData.totalProfitRate ? `${(Number(summaryData.totalProfitRate) *
                    100).toFixed(2)}%` : '0.00'}
                  </p>
                </div>
              </li>

              <li
                className={index === '3' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getMaintainCountDaysData', '3')}
              >
                <img src={list} />
                <div className="dashboard-number">
                  <p className="font-size-14">工单数/洗车台次</p>
                  <p className="font-size-22">{summaryData.count} / {summaryData.beautyCount}</p>
                </div>
              </li>

              <li
                className={index === '4' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getPerTicketSalesDate', '4')}
              >
                <img src={money} />
                <div className="dashboard-number">
                  <p className="font-size-14">客单价</p>
                  <p className="font-size-22">
                    {summaryData.salePerIntention
                      ? Number(summaryData.salePerIntention).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </li>

              <li
                className={index === '5' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getMaintainAutoPartDays', '5')}
              >
                <img src={money} />
                <div className="dashboard-number">
                  <p className="font-size-14">仓库采购金额</p>
                  <p className="font-size-22">
                    {summaryData.totalInPrice
                      ? Number(summaryData.totalInPrice).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </li>

              <li
                className={index === '6' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getMaintainIncomeUnpay', '6')}
              >
                <img src={money} />
                <div className="dashboard-number">
                  <p className="font-size-14">工单累计挂账</p>
                  <p className="font-size-22">
                    {summaryData.unpayIncome ? Number(summaryData.unpayIncome).toFixed(2) : '0.00'}
                  </p>
                </div>
              </li>
            </ul>
          </Col>

          <Col span={20}>
            <LineChart
              title={chartTitle}
              subtitle={chartSubtitle}
              unit={chartUnit}
              categories={categories}
              series={series}
              allowDecimals={allowDecimals}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
