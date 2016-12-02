import React from 'react'
import {Card, Icon} from 'antd'
import BarChart from '../../chart/BarChart'

export default class PresalesIntentionLost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let intentionLostTitle = [], intentionLostCount = [];
    this.props.source.map(item => {
      intentionLostTitle.push(item.name);
      intentionLostCount.push(parseInt(item.count));
    });

    let series = [{
      name: '次数',
      data: intentionLostCount
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 流失统计</span>}>
        <BarChart
          unit="流失(次)"
          categories={intentionLostTitle}
          series={series}
        />
      </Card>
    )
  }
}