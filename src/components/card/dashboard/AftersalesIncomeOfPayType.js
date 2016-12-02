import React from 'react'
import {Card, Icon} from 'antd'
import BarChart from '../../chart/BarChart'

export default class AftersalesIncomeOfPayType extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let categories = [], data = [];
    this.props.source.map(item => {
      categories.push(item.pay_type_name ? item.pay_type_name : '其他');
      data.push(Number(item.amount));
    });

    let series = [{
      name: '总额',
      data: data
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 支付情况统计(总额)</span>} className="mb15">
        <BarChart
          unit="总额(元)"
          categories={categories}
          series={series}
        />
      </Card>
    )
  }
}