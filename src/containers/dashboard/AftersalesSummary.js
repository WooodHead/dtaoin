import React from 'react';
import {Row, Col, Card} from 'antd';
import LineChart from '../../components/chart/LineChart';

export default class AftersalesSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: 'carCount',
    };
  }

  handleChartData(method) {
    this.props.loadChart(method);
  }

  render() {
    let {
      maintainCount,
      washAndDecorationCount,
      maintainIncome,
      salePerIntention,
      chartTitle,
      chartSubtitle,
      chartUnit,
      allowDecimals,
      maintainProfit,
      categories,
      series,
    } = this.props;

    return (
      <Row>
        <Col span={4}>
          <Card style={{height: '450px'}} bodyStyle={{padding: 0}} bordered={false}>
            <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getMaintainIncomeDaysData')}>
              <p>营业额</p>
              <h1>{Number(maintainIncome).toFixed(2)}</h1>
            </Card>
            <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getMaintainProfitDaysDate')}>
              <p>毛利润</p>
              <h1>{Number(maintainProfit).toFixed(2)}</h1>
            </Card>
            <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getMaintainCountDaysData')}>
              <p>工单数/洗车项目</p>
              <h1>{maintainCount} / {washAndDecorationCount}</h1>
            </Card>
            <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getPerTicketSalesDate')}>
              <p>客单价</p>
              <h1>{Number(salePerIntention).toFixed(2)}</h1>
            </Card>
          </Card>
        </Col>

        <Col span={20}>
          <Card style={{height: '450px'}}>
            <LineChart
              title={chartTitle}
              subtitle={chartSubtitle}
              unit={chartUnit}
              categories={categories}
              series={series}
              allowDecimals={allowDecimals}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
