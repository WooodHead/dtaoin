import React from 'react'
import {Row, Col, Card, Icon} from 'antd'
import LineChart from '../../chart/LineChart'

export default class AftersalesSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: 'carCount'
    }
  }

  handleChartData(method, cardName) {
    this.props.loadChart(method);
    this.setState({currentCard: cardName});
  }

  render() {
    let {currentCard} = this.state;
    let {
      maintainCount,
      washAndDecorationCount,
      maintainIncome,
      allMember,
      newMember,
      chartTitle,
      chartUnit,
      chartData,
      allowDecimals,
    } = this.props;

    let categories = [], data = [], allMemberData = [];
    chartData.map(item => {
      categories.push(item.cday);
      if (currentCard === 'member') {
        data.push(parseInt(item.count));
        allMemberData.push(parseInt(item.sum));
      } else if (currentCard === 'amount') {
        data.push(Number(item.incomes));
      } else {
        data.push(parseInt(item.count));
      }
    });

    let series = [{
      name: chartTitle,
      data: data
    }];

    if (allMemberData.length > 0) {
      series.push({
        name: '已有会员',
        data: allMemberData
      })
    }

    return (
      <Card title={<span><Icon type="line-chart"/> 业务概况</span>} className="mb15">
        <Row gutter={16} className="mb15">
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getMaintainCountDaysData', 'carCount')}>
              <h1>{maintainCount}</h1>
              <p>进厂台次</p>
            </Card>
          </Col>
          <Col span="6">
            <Card className="center"
                  onClick={this.handleChartData.bind(this, 'getMaintainWashAndDecorationDaysData', 'washCount')}>
              <h1>{washAndDecorationCount}</h1>
              <p>洗车项目数</p>
            </Card>
          </Col>
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getMaintainIncomeDaysData', 'amount')}>
              <h1>{maintainIncome}</h1>
              <p>总产值</p>
            </Card>
          </Col>
          <Col span="6">
            <Card className="center" onClick={this.handleChartData.bind(this, 'getMaintainMembersDaysData', 'member')}>
              <h1>{allMember}/{newMember}</h1>
              <p>已有/新增会员数</p>
            </Card>
          </Col>
        </Row>

        <LineChart
          title={chartTitle}
          unit={chartUnit}
          categories={categories}
          series={series}
          allowDecimals={allowDecimals}
        />
      </Card>
    )
  }
}
