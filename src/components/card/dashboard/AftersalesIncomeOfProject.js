import React from 'react'
import {Row, Col, Card, Icon} from 'antd'
import PieChart from '../../chart/PieChart'

export default class AftersalesIncomeOfProject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let countSeries = [], incomeSeries = [], profitSeries = [];
    this.props.source.map(item => {
      let countObj = {
        name: item.name.substr(0, 2),
        y: parseInt(item.count)
      };
      let incomeObj = {
        name: item.name.substr(0, 2),
        y: Number(item.amount)
      };
      let profitObj = {
        name: item.name.substr(0, 2),
        y: Number(item.profit)
      };
      countSeries.push(countObj);
      incomeSeries.push(incomeObj);
      profitSeries.push(profitObj);
    });

    return (
      <Card title={<span><Icon type="pie-chart"/> 产值分类统计</span>} className="mb15">
        <Row gutter={16}>
          <Col span="8">
            <PieChart
              name="项目占比"
              title="项目数量"
              unit="个"
              data={countSeries}
            />
          </Col>
          <Col span="8">
            <PieChart
              name="产值占比"
              title="产值"
              unit="元"
              data={incomeSeries}
            />
          </Col>
          <Col span="8">
            <PieChart
              name="毛利润"
              title="毛利润"
              unit="元"
              data={profitSeries}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}