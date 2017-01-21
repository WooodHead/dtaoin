import React from 'react';
import {Row, Col, Card} from 'antd';
import LineChart from '../../components/chart/LineChart';

export default class PresalesSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChartData(method) {
    this.props.loadChart(method);
  }

  render() {
    let {
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

    /*let categories = [], data = [];
    chartData.map(item => {
      categories.push(item.date);
      data.push(Number(item.count || item.total));
    });*/


    return (
      <div>
        <Row>
          <Col span={4}>
            <Card style={{height: '450px'}} bodyStyle={{ padding: 0 }} bordered={false}>
              <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getIncomesDaysData')}>
                <p>收入(元)</p>
                <h1>{Number(purchaseIncomeTotal).toFixed(2)}</h1>
              </Card>
              <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getNewDealDaysData')}>
                <p>成交台次</p>
                <h1>{dealAutos}</h1>
              </Card>
              <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getNewPotentialAndIntentionDaysData')}>
                <p>新增客户/意向</p>
                <h1>{intentionCustomerCount + '/'}{intentionIntentionCount}</h1>
              </Card>
              <Card style={{height: '112.5px'}} onClick={this.handleChartData.bind(this, 'getPurchaseFailDays')}>
                <p>流失客户/意向</p>
                <h1>{failCustomerCount + '/'}{failIntentionCount}</h1>
              </Card>
            </Card>
          </Col>

          <Col span={20}>
            <Card style={{height: '450px'}}>
              <LineChart
                title={chartTitle}
                unit={chartUnit}
                categories={categories}
                series={series}
              />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}
