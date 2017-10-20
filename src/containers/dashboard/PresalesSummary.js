import React from 'react';
import { Row, Col, Card } from 'antd';
import LineChart from '../../components/chart/LineChart';

require('./dashboard.less');
const img = require('../../images/home/icon1.png');
const money = require('../../images/dashboard/chart_icon_money.png');
const list = require('../../images/dashboard/chart_icon_list.png');

export default class PresalesSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: '1',
    };
    [
      'handleChartData',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleChartData(method, index) {
    this.setState({ index });
    this.props.loadChart(method);
  }

  render() {
    const {
      dealAutos,
      purchaseIncomeTotal,
      chartTitle,
      chartUnit,
      categories,
      series,
      intentionCustomerCount,
      intentionIntentionCount,
      failCustomerCount,
      failIntentionCount,
    } = this.props;

    const { index } = this.state;

    /* let categories = [], data = [];
     chartData.map(item => {
     categories.push(item.date);
     data.push(Number(item.count || item.total));
     });*/

    return (
      <div>
        <Row className="dashboard-border">
          <Col className="dashboard-title" span={4}>
            <ul>
              <li
                className={index === '1' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getIncomesDaysData', '1')}
              >
                <img src={money} />
                <div className="dashboard-number">
                  <p className="font-size-14">收入(元)</p>
                  <p className="font-size-22">{Number(purchaseIncomeTotal).toFixed(2)}</p>
                </div>
              </li>

              <li
                className={index === '2' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getNewDealDaysData', '2')}
              >
                <img src={list} />
                <div className="dashboard-number">
                  <p className="font-size-14">成交台次</p>
                  <p className="font-size-22">{dealAutos}</p>
                </div>
              </li>

              <li
                className={index === '3' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getNewPotentialAndIntentionDaysData', '3')}
              >
                <img src={list} />
                <div className="dashboard-number">
                  <p className="font-size-14">新增客户/意向</p>
                  <p className="font-size-22">{`${intentionCustomerCount
                  }/`}{intentionIntentionCount}</p>
                </div>
              </li>

              <li
                className={index === '4' ? 'active' : ''}
                onClick={this.handleChartData.bind(this, 'getPurchaseFailDays', '4')}
              >
                <img src={list} />
                <div className="dashboard-number">
                  <p className="font-size-14">流失客户/意向</p>
                  <p className="font-size-22">{`${failCustomerCount  }/`}{failIntentionCount}</p>
                </div>
              </li>
            </ul>
          </Col>

          <Col span={20}>
            <LineChart
              title={chartTitle}
              unit={chartUnit}
              categories={categories}
              series={series}
              lineHeight={285}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
