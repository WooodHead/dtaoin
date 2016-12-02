import React from 'react'
import {Row, Col, Card, Icon} from 'antd'
import LineChart from '../../chart/LineChart'

export default class PresalesSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChartData(method) {
    this.props.loadChart(method);
  }

  render() {
    let {
      potentialCustomers,
      dealAutos,
      purchaseIncomeTotal,
      chartTitle,
      chartUnit,
      chartData
    } = this.props;

    let categories = [], data = [];
    chartData.map(item => {
      categories.push(item.cday);
      data.push(Number(item.count || item.total));
    });

    let series = [{
      name: chartTitle,
      data: data
    }];

    return (
      <Card title={<span><Icon type="line-chart"/> 业务概况</span>} className="mb15">
        <Row gutter={16} className="mb15">
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getNewPotentialDaysData')}>
              <h1>{potentialCustomers}</h1>
              <p>新增潜在客户</p>
            </Card>
          </Col>
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getNewDealDaysData')}>
              <h1>{dealAutos}</h1>
              <p>成交台次</p>
            </Card>
          </Col>
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getIncomesDaysData')}>
              <h1>{purchaseIncomeTotal}</h1>
              <p>总收入</p>
            </Card>
          </Col>
          <Col span="6" className="hide">
            <Card className="center">
              <h1>28/8</h1>
              <p>跟进/回访人数</p>
            </Card>
          </Col>
        </Row>

        <LineChart
          title={chartTitle}
          unit={chartUnit}
          categories={categories}
          series={series}
        />
      </Card>
    )
  }
}
