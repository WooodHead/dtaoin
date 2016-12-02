import React from 'react'
import {Card, Icon} from 'antd'
import BarChart from '../../chart/BarChart'

export default class AftersalesIncomeOfPayTimes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let categories = [], data = [];
    this.props.source.map(item => {
      categories.push(item.pay_type_name ? item.pay_type_name : '其他');
      data.push(Number(item.count));
    });

    let series = [{
      name: '次数',
      data: data
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 支付情况统计(次数)</span>} className="mb15">
        <BarChart
          unit="次数(次)"
          categories={categories}
          series={series}
        />
      </Card>
    )
  }
}