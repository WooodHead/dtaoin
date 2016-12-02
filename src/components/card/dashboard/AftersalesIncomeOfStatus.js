import React from 'react'
import {Card, Icon} from 'antd'
import PieChart from '../../chart/PieChart'

export default class AftersalesIncomeOfStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let seriesData = [];
    this.props.source.map(item => {
      let obj = {
        name: item.status_name,
        y: Number(item.amount)
      };
      seriesData.push(obj);
    });

    return (
      <Card title={<span><Icon type="pie-chart"/> 结算情况统计</span>} className="mb15">
        <PieChart
          name="占比"
          unit="元"
          data={seriesData}
        />
      </Card>
    )
  }
}